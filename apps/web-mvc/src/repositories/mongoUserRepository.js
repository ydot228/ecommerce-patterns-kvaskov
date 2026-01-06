class MongoUserRepository {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  async list() {
    const docs = await this.UserModel.find().lean();
    return docs.map(d => ({ id: String(d._id), email: d.email, fullName: d.fullName }));
  }

  async getById(id) {
    const doc = await this.UserModel.findById(id).lean();
    if (!doc) return null;
    return { id: String(doc._id), email: doc.email, fullName: doc.fullName };
  }

  async create(data) {
    const doc = await this.UserModel.create({ email: data.email, fullName: data.fullName });
    return { id: String(doc._id), email: doc.email, fullName: doc.fullName };
  }

  async update(id, patch) {
    const doc = await this.UserModel.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return null;
    return { id: String(doc._id), email: doc.email, fullName: doc.fullName };
  }

  async remove(id) {
    const res = await this.UserModel.deleteOne({ _id: id });
    return res.deletedCount === 1;
  }
}

module.exports = { MongoUserRepository };
