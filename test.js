const dbData = [
  {
    id: 1,
    title: 'Contoh Judul',
    body: 'Isi konten...',
    tags: ['tag1', 'tag2'],
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-02T08:30:00Z',
  },
  {
    id: 1,
    title: 'Contoh Judul',
    body: 'Isi konten...',
    tags: ['tag1', 'tag2'],
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-02T08:30:00Z',
  },
];

const mapDBToModel = ({ id, title, tags, created_at, updated_at }) => ({
  id,
  title,
  tags,
});

console.log(
  dbData.map((data) => ({
    data: data.id,
    title: data.title,
    tags: data.tags,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }))
);
