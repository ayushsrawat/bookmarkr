import { useEffect, useState, useMemo } from "react";
import "./styles/Home.css";
import Panel from "./Panel";

const url: string = "https://gist.githubusercontent.com/ayushsrawat/25062ec55d234974c2b3ea7a02a65b8f/raw/d084191041fc1c4a9702ba4eed6aeabaf080a6e9/chrome_bookmark.json";
const BASE_PARENT_ID: number = 1;

export type FileType = {
  id: number;
  title: string;
  url: string;
  parentId: number;
};

export type FolderType = {
  id: number;
  title: string;
  parentId: number;
};

function Home() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [openPanels, setOpenPanels] = useState<number[]>([BASE_PARENT_ID]);
  const [highlightedFolders, setHighlightedFolders] = useState<number[]>([]);

  const parentMap = useMemo(
    () =>
      folders.reduce((map, folder) => {
        map[folder.id] = folder.parentId;
        return map;
      }, {} as Record<number, number>),
    [folders]
  );

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setFiles(json.files || []);
      setFolders(json.folders || []);
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFolderClick = (folderId: number) => {
    setOpenPanels((prevOpenPanels) => {
      if (prevOpenPanels.includes(folderId)) {
        // close panel action
        const findDescendants = (id: number): number[] => {
          return folders
            .filter((folder) => folder.parentId === id)
            .flatMap((folder) => [folder.id, ...findDescendants(folder.id)]);
        };
        const allDescendants = findDescendants(folderId);
        return prevOpenPanels.filter((id) => id !== folderId && !allDescendants.includes(id));
      } else {
        // open panel action
        let updatedOpenPanels: number[] = [];
        let currentFolderId: number = folderId;
        while (currentFolderId !== BASE_PARENT_ID) {
          updatedOpenPanels.push(currentFolderId);
          currentFolderId = parentMap[currentFolderId] || BASE_PARENT_ID;
        }
        updatedOpenPanels.push(BASE_PARENT_ID);
        return updatedOpenPanels.reverse();
      }
    });
    setHighlightedFolders(() => {
      let updatedHighlightedFolders: number[] = [];
      let currentFolderId: number = folderId;
      while (currentFolderId != BASE_PARENT_ID) {
        updatedHighlightedFolders.push(currentFolderId);
        currentFolderId = parentMap[currentFolderId] || BASE_PARENT_ID;
      }
      return updatedHighlightedFolders;
    });
  };

  return (
    <div className="home">
      {openPanels.map((folderId, _) => {
        const currentFolders = folders.filter((f) => f.parentId === folderId);
        const currentFiles = files.filter((f) => f.parentId === folderId);
        return (
          <Panel
            key={folderId}
            folders={currentFolders}
            files={currentFiles}
            onFolderClick={handleFolderClick}
            highlightedFolders={highlightedFolders}
          />
        );
      })}
    </div>
  );
}
export default Home;
