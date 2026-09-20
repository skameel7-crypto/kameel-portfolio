import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";

import {
  db
} from "../firebase";

export async function getCollection(
  name
) {

  const q = query(
    collection(db, name),
    orderBy("order", "asc")
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data()
    })
  );
}

export async function saveItem(
  name,
  data,
  id
) {

  if (id) {

    await setDoc(
      doc(db, name, id),
      data,
      {
        merge: true
      }
    );

    return id;
  }

  const reference =
    await addDoc(
      collection(db, name),
      data
    );

  return reference.id;
}

export async function removeItem(
  name,
  id
) {

  await deleteDoc(
    doc(db, name, id)
  );
}

export async function getProfile() {

  const snapshot =
    await getDocs(
      collection(db, "profile")
    );

  if (snapshot.empty) {
    return null;
  }

  const first =
    snapshot.docs[0];

  return {
    id: first.id,
    ...first.data()
  };
}

export async function saveProfile(
  data,
  id = "main"
) {

  await setDoc(
    doc(db, "profile", id),
    data,
    {
      merge: true
    }
  );
}