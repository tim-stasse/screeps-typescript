function getRandomFreePos(startPos: RoomPosition, distance: number) {
  let x, y;

  do {
    x = startPos.x + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
    y = startPos.y + Math.floor(Math.random() * (distance * 2 + 1)) - distance;
  } while (
    (x + y) % 2 != (startPos.x + startPos.y) % 2 ||
    Game.map.getRoomTerrain(startPos.roomName).get(x, y) === TERRAIN_MASK_WALL
  );

  return new RoomPosition(x, y, startPos.roomName);
}

function build(spawn: StructureSpawn, structureType: BuildableStructureConstant) {
  let structures = spawn.room.find(FIND_STRUCTURES, { filter: { structureType, my: true } });

  for (let i = 0; i < CONTROLLER_STRUCTURES[structureType][spawn.room.controller!.level] - structures.length; i++) {
    getRandomFreePos(spawn.pos, 5).createConstructionSite(structureType);
  }
}

function calcBodyCost(body: BodyPartConstant[]) {
  return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
}

export function run(spawn: StructureSpawn) {
  build(spawn, STRUCTURE_EXTENSION);
  build(spawn, STRUCTURE_TOWER);

  let workerBody: BodyPartConstant[] = [],
    bodyIteration: BodyPartConstant[] = [MOVE, MOVE, WORK, CARRY];

  while (
    calcBodyCost(workerBody) + calcBodyCost(bodyIteration) <= spawn.room.energyAvailable &&
    workerBody.length + bodyIteration.length <= MAX_CREEP_SIZE
  ) {
    workerBody = workerBody.concat(bodyIteration);
  }

  spawn.spawnCreep(workerBody, "u1", { memory: { role: "upgrader" } });
  spawn.spawnCreep(workerBody, "u2", { memory: { role: "upgrader" } });

  if (spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
    spawn.spawnCreep(workerBody, "b1", { memory: { role: "builder" } });
  }

  spawn.spawnCreep(workerBody, "h1", { memory: { role: "harvester" } });
  spawn.spawnCreep(workerBody, "h2", { memory: { role: "harvester" } });
}
