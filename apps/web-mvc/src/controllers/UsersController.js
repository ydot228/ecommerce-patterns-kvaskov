function getRepo(req) {
  return req.app.locals.userRepo;
}

function normalizeUserInput(body) {
  const email = String(body.email || '').trim();
  const fullName = String(body.fullName || '').trim();

  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Некорректный email' };
  }
  if (!fullName) {
    return { ok: false, error: 'ФИО/имя не может быть пустым' };
  }
  return { ok: true, value: { email, fullName } };
}

// ----------------------------- HTML pages (View) -----------------------------

async function listPage(req, res) {
  const users = await getRepo(req).list();
  res.render('userList', { title: 'Пользователи', users });
}

async function newPage(req, res) {
  res.render('userForm', { title: 'Новый пользователь', user: null, error: null });
}

async function editPage(req, res) {
  const user = await getRepo(req).getById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.render('userForm', { title: 'Редактирование', user, error: null });
}

async function createFromForm(req, res) {
  const parsed = normalizeUserInput(req.body);
  if (!parsed.ok) {
    return res.status(400).render('userForm', {
      title: 'Новый пользователь',
      user: req.body,
      error: parsed.error
    });
  }
  await getRepo(req).create(parsed.value);
  res.redirect('/users');
}

async function updateFromForm(req, res) {
  const parsed = normalizeUserInput(req.body);
  if (!parsed.ok) {
    return res.status(400).render('userForm', {
      title: 'Редактирование',
      user: { id: req.params.id, ...req.body },
      error: parsed.error
    });
  }
  const updated = await getRepo(req).update(req.params.id, parsed.value);
  if (!updated) return res.status(404).send('User not found');
  res.redirect('/users');
}

async function deleteFromForm(req, res) {
  await getRepo(req).remove(req.params.id);
  res.redirect('/users');
}

// ----------------------------- JSON API (Controller) -----------------------------

async function listApi(req, res) {
  const users = await getRepo(req).list();
  res.json({ data: users });
}

async function createApi(req, res) {
  const parsed = normalizeUserInput(req.body);
  if (!parsed.ok) return res.status(400).json({ error: { code: 'VALIDATION', message: parsed.error } });

  const user = await getRepo(req).create(parsed.value);
  res.status(201).json({ data: user });
}

async function updateApi(req, res) {
  const parsed = normalizeUserInput(req.body);
  if (!parsed.ok) return res.status(400).json({ error: { code: 'VALIDATION', message: parsed.error } });

  const user = await getRepo(req).update(req.params.id, parsed.value);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });

  res.json({ data: user });
}

async function deleteApi(req, res) {
  const ok = await getRepo(req).remove(req.params.id);
  if (!ok) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });

  res.status(204).send();
}

module.exports = {
  listPage,
  newPage,
  editPage,
  createFromForm,
  updateFromForm,
  deleteFromForm,
  listApi,
  createApi,
  updateApi,
  deleteApi
};
