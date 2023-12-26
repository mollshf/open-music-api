const mapDBToModel = ({ id, title, body, tags, created_at, updated_at }) => ({
  id,
  title,
  body,
  tags,
  createdAt: created_at,
  updatedAt: updated_at,
});

// mapping get all data songs
const mapViewData = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});
module.exports = { mapDBToModel, mapViewData };
