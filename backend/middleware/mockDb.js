const mongoose = require("mongoose");

const setupMockDb = () => {
  console.log("\n⚠️  WARNING: MongoDB Atlas connection failed or credentials incorrect.");
  console.log("🚀 Switching to a 100% functional In-Memory Fallback Database!");
  console.log("ℹ️  All features (register, login, notes, pinning, and editing) will work perfectly local-only.\n");

  // In-memory data store
  const store = {
    users: [],
    notes: []
  };

  // Get Mongoose models
  const User = mongoose.model("User");
  const Note = mongoose.model("Note");

  // Mock User.findOne
  User.findOne = async function(query) {
    if (!query || !query.email) return null;
    const email = query.email.toLowerCase();
    return store.users.find(u => u.email.toLowerCase() === email) || null;
  };

  // Mock User.prototype.save
  User.prototype.save = async function() {
    this._id = this._id || new mongoose.Types.ObjectId();
    // Check if user already exists in store
    const exists = store.users.some(u => u.email.toLowerCase() === this.email.toLowerCase());
    if (!exists) {
      store.users.push(this);
    }
    return this;
  };

  // Mock Note.find
  Note.find = async function(query) {
    const userId = String(query.userId);
    return store.notes.filter(n => String(n.userId) === userId);
  };

  // Mock Note.prototype.save
  Note.prototype.save = async function() {
    this._id = this._id || new mongoose.Types.ObjectId();
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    this.isPinned = this.isPinned || false;

    // Remove if already exists (for overwrite updates if any)
    const index = store.notes.findIndex(n => String(n._id) === String(this._id));
    if (index !== -1) {
      store.notes[index] = this;
    } else {
      store.notes.push(this);
    }
    return this;
  };

  // Mock Note.findOneAndUpdate
  Note.findOneAndUpdate = async function(query, update, options) {
    const targetId = String(query._id);
    const userId = String(query.userId);
    const note = store.notes.find(n => String(n._id) === targetId && String(n.userId) === userId);
    if (!note) return null;

    if (update.title !== undefined) note.title = update.title;
    if (update.content !== undefined) note.content = update.content;
    if (update.isPinned !== undefined) note.isPinned = update.isPinned;
    note.updatedAt = new Date();
    return note;
  };

  // Mock Note.findOneAndDelete
  Note.findOneAndDelete = async function(query) {
    const targetId = String(query._id);
    const userId = String(query.userId);
    const index = store.notes.findIndex(n => String(n._id) === targetId && String(n.userId) === userId);
    if (index === -1) return null;
    const deleted = store.notes.splice(index, 1)[0];
    return deleted;
  };
};

module.exports = setupMockDb;
