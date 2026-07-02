const jobs = new Map();

module.exports = {
  set: (id, job) => jobs.set(id, job),
  get: (id) => jobs.get(id),
  update: (id, data) => {
    const job = jobs.get(id);
    if (!job) return;
    jobs.set(id, { ...job, ...data });
  }
};