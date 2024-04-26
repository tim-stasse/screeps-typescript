import * as building from "building";
import * as roles from "roles";
import * as tower from "tower";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: keyof typeof import("roles");
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  var spawnRooms: Room[] = [];

  for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    var spawnRoom = spawn.room;

    building.run(spawn);

    if (!_.any(spawnRooms, { name: spawnRoom.name })) {
      spawnRooms.concat(spawnRoom);
    }
  }

  spawnRooms.forEach((spawnRoom) => {
    var towers = spawnRoom.find(FIND_MY_STRUCTURES, {
      filter: (structure): structure is StructureTower => structure instanceof StructureTower
    });
    towers.forEach(tower.run);
  });

  for (const creepName in Memory.creeps) {
    // Automatically delete memory of missing creeps
    if (!(creepName in Game.creeps)) {
      delete Memory.creeps[creepName];
    } else {
      var creep = Game.creeps[creepName];

      roles[creep.memory.role].run(creep);
    }
  }
});
