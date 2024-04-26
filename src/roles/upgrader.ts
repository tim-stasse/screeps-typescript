declare global {
  interface CreepMemory {
    upgrading?: boolean;
  }
}

export function run(creep: Creep) {
  if (creep.memory.upgrading && creep.store.energy === 0) {
    creep.memory.upgrading = false;
    creep.say("harvesting");
  }

  if (!creep.memory.upgrading && creep.store.energy === creep.store.getCapacity()) {
    creep.memory.upgrading = true;
    creep.say("upgrading");
  }

  if (creep.memory.upgrading) {
    if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}
