/* =========================================================
   Kết nối Firebase (Firestore + đăng nhập ẩn danh)
   File này được app.js nạp tự động khi đã có cấu hình Firebase.
   ========================================================= */
const V = '12.4.0';
const BASE = `https://www.gstatic.com/firebasejs/${V}/`;

export async function createBackend(config) {
  const { initializeApp } = await import(BASE + 'firebase-app.js');
  const fs = await import(BASE + 'firebase-firestore.js');
  const au = await import(BASE + 'firebase-auth.js');

  const app = initializeApp(config);
  let db;
  try {
    db = fs.initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() })
    });
  } catch (e) {
    db = fs.getFirestore(app);
  }

  // Đăng nhập ẩn danh (dùng lại phiên cũ nếu có → chạy được khi mất mạng)
  const auth = au.getAuth(app);
  const user = await new Promise((resolve) => {
    const off = au.onAuthStateChanged(auth, (u) => { off(); resolve(u); });
  });
  if (!user) await au.signInAnonymously(auth);

  const ref = (path) => fs.doc(db, path);
  const conv = (v) => {
    if (v && typeof v === 'object' && v.__op === 'inc') return fs.increment(v.n);
    if (v && typeof v === 'object' && v.__op === 'del') return fs.deleteField();
    return v;
  };
  const flat = (ops) => {
    const out = [];
    ops.forEach(([segs, val]) => { out.push(new fs.FieldPath(...segs.map(String)), conv(val)); });
    return out;
  };

  return {
    kind: 'firebase',
    get uid() { return auth.currentUser ? auth.currentUser.uid : null; },
    async get(path) {
      const s = await fs.getDoc(ref(path));
      return s.exists() ? s.data() : null;
    },
    set(path, data) { return fs.setDoc(ref(path), data); },
    update(path, ops) {
      if (!ops || !ops.length) return Promise.resolve();
      const args = flat(ops);
      return fs.updateDoc(ref(path), args[0], args[1], ...args.slice(2));
    },
    remove(path) { return fs.deleteDoc(ref(path)); },
    add(path, data) { return fs.addDoc(fs.collection(db, path), data); },
    onDoc(path, cb, onErr) {
      return fs.onSnapshot(ref(path), (s) => cb(s.exists() ? s.data() : null, { fromCache: s.metadata.fromCache, pending: s.metadata.hasPendingWrites }), onErr);
    },
    onCol(path, opts, cb, onErr) {
      const parts = [fs.collection(db, path)];
      if (opts && opts.orderBy) parts.push(fs.orderBy(opts.orderBy, opts.desc ? 'desc' : 'asc'));
      if (opts && opts.limit) parts.push(fs.limit(opts.limit));
      const q = parts.length > 1 ? fs.query(...parts) : parts[0];
      return fs.onSnapshot(q, (s) => cb(s.docs.map((d) => ({ id: d.id, data: d.data() })), { fromCache: s.metadata.fromCache, pending: s.metadata.hasPendingWrites }), onErr);
    },
    txn(path, fn) {
      return fs.runTransaction(db, async (tx) => {
        const r = ref(path);
        const s = await tx.get(r);
        const ops = fn(s.exists() ? s.data() : null);
        if (ops && ops.length) { const a = flat(ops); tx.update(r, a[0], a[1], ...a.slice(2)); }
        return !!(ops && ops.length);
      });
    }
  };
}

