import "./styles/Panel.css";

export type PanelProps = {
  folders: { id: number; name: string }[];
  files: { id: number; name: string; url: string }[];
  onFolderClick: (folderId: number) => void;
  highlightedFolders: number[];
};

function Panel({ folders, files, onFolderClick, highlightedFolders }: PanelProps) {
  return (
    <div className="side-bar">
      <div className="folder-list">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`folder-item ${highlightedFolders.includes(folder.id) ? "highlighted" : ""}`}
            onClick={() => onFolderClick(folder.id)}
          >
            <i className="fa-regular fa-folder"></i>
            {folder.name}
          </div>
        ))}
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <i className="fa-regular fa-file"></i>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Panel;
