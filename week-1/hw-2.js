const folders = [
  {
    id: 5,
    name: "Klasör 1",
    files: [
      { id: 17, name: "profil.jpg" },
      { id: 18, name: "manzara.jpg" },
    ],
  },
  {
    id: 6,
    name: "Klasör 2",
    files: [
      { id: 21, name: "foto.png" },
      { id: 22, name: "dosya.xls" },
    ],
  },
  {
    id: 7,
    name: "Klasör 3",
    files: [],
  },
];

// parentFolderOf(17) // ==> 5

// findFile
function findFolderCoordinat(folders, id) {
  return folders.findIndex((folder) => folder.id === id) || -1;
}

function findFileCoordinat(folders, id) {
  let coord;
  const isThere = folders.find((folder, folderIndex) => {
    return folder.files?.find((file, fileIndex) => {
      coord = { folderIndex, fileIndex };
      return file.id === id;
    });
  });

  if (isThere) return coord;
  return -1;
}

function move(folders, folder_id, file_id) {
  const copyResult = copy(folders, folder_id, file_id);
  if (!copyResult) return -1;

  const { folderIndex, fileIndex } = copyResult;
  folders[folderIndex].files.splice(fileIndex, 1);
}

function copy(folders, folder_id, file_id) {
  const destFolderIndex = findFolderCoordinat(folders, folder_id);
  if (!destFolderIndex) return -1;

  const sourceFolder = findFileCoordinat(folders, file_id);
  if (!sourceFolder) return -1;

  const { folderIndex, fileIndex } = sourceFolder;
  folders[destFolderIndex].files.push(folders[folderIndex].files[fileIndex]);

  return { folderIndex, fileIndex };
}

function removeFile(folders, file_id) {
  const sourceFolder = findFileCoordinat(folders, file_id);
  if (!sourceFolder) return -1;

  const { folderIndex, fileIndex } = sourceFolder;
  folders[folderIndex].files.splice(fileIndex, 1);
}

function removeFolder(folders, folder_id) {
  const index = findFolderCoordinat(folders, folder_id);
  if (!index) return -1;
  return folders.splice(index, 1);
}

function parentFolderOf(folders, file_id) {
  const folderCoord = findFileCoordinat(folders, file_id);
  if (!folderCoord) return -1;

  const { folderIndex, fileIndex } = folderCoord;
  return folderIndex;
}

