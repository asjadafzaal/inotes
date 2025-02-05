import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Modal from "./Modal";
import NotesList from "./NotesList";
import Background from "./Background";
import Searchbar from "./Searchbar";
import { getToken } from "../authService"; // ✅ Import token helper

const Addnote = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // ✅ Fetch Notes for Logged-in User
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleOpenModal = (note = null) => {
    if (note) {
      setCurrentNoteId(note._id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
    } else {
      setCurrentNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast.error("Title and content cannot be empty!", { position: "top-right" });
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      if (currentNoteId) {
        // Update note
        const response = await axios.put(
          `http://localhost:5000/api/notes/${currentNoteId}`,
          { title: noteTitle, content: noteContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === currentNoteId ? response.data : note))
        );
        toast.info("Note updated!", { position: "top-right" });
      } else {
        // Add new note
        const response = await axios.post(
          "http://localhost:5000/api/notes",
          { title: noteTitle, content: noteContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotes((prevNotes) => [response.data, ...prevNotes]);
        toast.success("Note added!", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Error saving note. Try again!", { position: "top-right" });
    }

    setIsModalOpen(false);
    setNoteTitle("");
    setNoteContent("");
    setCurrentNoteId(null);
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      toast.error("Note deleted!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note. Try again!", { position: "top-right" });
    }
  };

  // ✅ Handle Pin/Unpin Functionality
  const handleTogglePin = async (id) => {
    try {
      const token = getToken();
      if (!token) return;

      const noteToUpdate = notes.find((note) => note._id === id);
      if (!noteToUpdate) return;

      const updatedNote = { ...noteToUpdate, isPinned: !noteToUpdate.isPinned };

      // Send update request to backend
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { isPinned: updatedNote.isPinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend state
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error pinning/unpinning note:", error);
      toast.error("Error updating pin status. Try again!", { position: "top-right" });
    }
  };

  // Filter notes based on the search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="relative">
      <ToastContainer />
      <Searchbar onSearch={handleSearch} />

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} noteTitle={noteTitle} setNoteTitle={setNoteTitle} noteContent={noteContent} setNoteContent={setNoteContent} onSaveNote={handleSaveNote} />

      {/* Conditional Rendering */}
      {notes.length === 0 && searchTerm === "" ? (
        <Background />
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80">
          <img
            src="src/assets/notfound.png" 
            alt="Not Found"
            className="w-28 h-28 mb-4"
          />
          <p className="text-xl text-gray-700">No notes found</p>
        </div>
      ) : (
        <NotesList
          notes={filteredNotes}
          onDeleteNote={handleDeleteNote}
          onTogglePin={handleTogglePin}
          onEditNote={handleOpenModal}
        />
      )}
    </div>
  );
};

export default Addnote;
