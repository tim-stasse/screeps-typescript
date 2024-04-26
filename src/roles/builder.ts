declare global {
  interface CreepMemory {
    building?: boolean;
  }
}

export function run(creep: Creep) {
  if (creep.memory.building && creep.store.energy === 0) {
    creep.memory.building = false;
    creep.say("harvesting");
  }

  if (!creep.memory.building && creep.store.energy === creep.store.getCapacity()) {
    creep.memory.building = true;
    creep.say("building");
  }

  if (creep.memory.building) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (targets.length && creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}
