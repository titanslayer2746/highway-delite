import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Note {
  id: string;
  title: string;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${user?.email}`);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      }));
      setNotes(parsedNotes);
    }
  }, [user?.email]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`notes_${user.email}`, JSON.stringify(notes));
    }
  }, [notes, user?.email]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const createNote = () => {
    if (!noteInput.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteInput.trim(),
      createdAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setNoteInput("");
    setShowDialog(false);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setNoteInput("");
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav
        className={`bg-white shadow-sm border-b border-gray-200 transition-all duration-200 ${
          showDialog ? "blur-sm" : ""
        }`}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-gray-800 bg-gray-200 px-2 py-1 rounded">
                Dashboard
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="text-blue-600 font-medium text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`max-w-md mx-auto p-4 space-y-4 transition-all duration-200 ${
          showDialog ? "blur-sm" : ""
        }`}
      >
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Welcome, {user?.name || "Jonas Kahnwald"} !
          </h2>
          <p className="text-sm text-gray-600">
            Email: {user?.email || "xxxxxx@xxxx.com"}
          </p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create Note
        </button>

        {/* Notes Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Notes</h3>
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-between"
              >
                <span className="text-sm text-gray-800 font-medium">
                  {note.title}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Note
              </h3>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter your note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    createNote();
                  }
                }}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleDialogClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNote}
                  disabled={!noteInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
