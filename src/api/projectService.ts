// import { log, project } from '../store.ts';
//
// /**
//  * Service for Project-related operations
//  */
// export const projectService = {
//   /**
//    * Update project BPM and log the change
//    * @param projectId - Project ID
//    * @param newBpm - New BPM value
//    */
//   updateBpm(projectId: string, newBpm: number): void {
//     if (!projectId) return;
//
//     // Log the update
//     const thisLog = {
//       oper: "UPDATE",
//       type: "PROJECT",
//       project: projectId,
//       track: null,
//       note: null,
//       payload: { bpm: newBpm }
//     };
//
//     log.update(ls => ls.concat(thisLog));
//   },
//
//   /**
//    * Update project name and log the change
//    * @param projectId - Project ID
//    * @param newName - New project name
//    */
//   updateName(projectId: string, newName: string): void {
//     if (!projectId) return;
//
//     // Log the update
//     const thisLog = {
//       oper: "UPDATE",
//       type: "PROJECT",
//       project: projectId,
//       track: null,
//       note: null,
//       payload: { name: newName }
//     };
//
//     log.update(ls => ls.concat(thisLog));
//   }
// };
//
// /**
//  * Hook for Project operations
//  * @returns Object with methods for Project operations
//  */
// export function useProject() {
//   return {
//     /**
//      * Update project BPM and log the change
//      * @param newBpm - New BPM value
//      */
//     updateBpm(newBpm: number): void {
//       if (!$project) return;
//
//       const oldBpm = $project.bpm;
//
//       // Only log if the value actually changed
//       if (oldBpm !== newBpm) {
//         $project.bpm = newBpm;
//         projectService.updateBpm($project.id, newBpm);
//       }
//     },
//
//     /**
//      * Update project name and log the change
//      * @param newName - New project name
//      */
//     updateName(newName: string): void {
//       if (!$project) return;
//
//       const oldName = $project.name;
//
//       // Only log if the value actually changed
//       if (oldName !== newName) {
//         $project.name = newName;
//         projectService.updateName($project.id, newName);
//       }
//     }
//   };
// }