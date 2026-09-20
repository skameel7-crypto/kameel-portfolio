import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FileText,
  ImagePlus,
  LogOut,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { isAdminUser, logout, watchAuth } from "../services/auth";
import {
  getCollection,
  getProfile,
  removeItem,
  saveItem,
  saveProfile,
} from "../services/data";
import { fileToDataUrl } from "../utils/fileToDataUrl";
import {
  defaultEducation,
  defaultProfile,
  defaultProjects,
  defaultSkills,
} from "../data/defaultData";

const emptyProject = {
  title: "",
  category: "UI/UX Design",
  description: "",
  tools: [],
  image: "",
  images: [],
  figmaUrl: "",
  pdfUrl: "",
  liveUrl: "",
  order: 99,
};

const emptySkill = { name: "", category: "Design", level: 80, order: 99 };

const emptyEducation = {
  degree: "",
  institution: "",
  period: "",
  description: "",
  order: 99,
};

export default function AdminDashboard() {
  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(defaultProfile);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [skillForm, setSkillForm] = useState(emptySkill);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editing, setEditing] = useState(null);

  useEffect(() => watchAuth((u) => setUser(u)), []);

  useEffect(() => {
    if (user && isAdminUser(user)) loadData();
  }, [user]);

  function showMessage(text, type = "info") {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 6000);
  }

  async function loadData() {
    try {
      const [p, s, e, pr] = await Promise.all([
        getProfile().catch(() => null),
        getCollection("skills").catch(() => []),
        getCollection("education").catch(() => []),
        getCollection("projects").catch(() => []),
      ]);

      setProfile({ ...defaultProfile, ...(p || {}) });
      setSkills(s);
      setEducation(e);
      setProjects(pr);
    } catch (err) {
      showMessage(err.message || "Could not load data.", "error");
    }
  }

  if (user === undefined) {
    return (
      <div className="admin-page">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdminUser(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  const save = async (fn, successText = "Saved successfully.") => {
    try {
      await fn();
      showMessage(successText, "success");
      await loadData();
    } catch (err) {
      console.error("[admin] save failed:", err);

      const code = err?.code || "";
      const msg = err?.message || "Could not save.";

      let friendly = msg;
      if (code.includes("permission-denied")) {
        friendly =
          "Permission denied. Open Firebase Console → Firestore → Rules and allow writes for authenticated users.";
      } else if (code.includes("unauthenticated")) {
        friendly = "Your session expired. Please log in again.";
      }

      showMessage(friendly, "error");
    }
  };

  const saveProfileAction = () =>
    save(() => saveProfile(profile), "Profile saved.");

  const handlePhoto = async (file) => {
    try {
      const data = await fileToDataUrl(file, 700 * 1024);
      setProfile((p) => ({ ...p, photo: data }));
      showMessage("Photo selected. Click Save Profile to persist.", "info");
    } catch (e) {
      showMessage(e.message, "error");
    }
  };

  const handleResume = async (file) => {
    try {
      if (!file) return;
      if (file.type !== "application/pdf") {
        showMessage("Resume must be a PDF file.", "error");
        return;
      }
      const data = await fileToDataUrl(file, 700 * 1024);
      setProfile((p) => ({ ...p, resumeUrl: data }));
      showMessage("Resume selected. Click Save Profile to persist.", "info");
    } catch (e) {
      showMessage(e.message, "error");
    }
  };

  const projectImage = async (file) => {
    try {
      const data = await fileToDataUrl(file, 500 * 1024);
      setProjectForm((p) => ({ ...p, image: data }));
    } catch (e) {
      showMessage(e.message, "error");
    }
  };

  const editSkill = (item) => {
    setSkillForm(item);
    setEditing(item.id);
    setTab("skills");
  };

  const editEducation = (item) => {
    setEducationForm(item);
    setEditing(item.id);
    setTab("education");
  };

  const editProject = (item) => {
    setProjectForm({
      ...item,
      tools: item.tools || [],
      images: item.images || [],
    });
    setEditing(item.id);
    setTab("projects");
  };

  const saveSkill = () =>
    save(async () => {
      await saveItem(
        "skills",
        {
          ...skillForm,
          level: Number(skillForm.level),
          order: Number(skillForm.order),
        },
        editing
      );
      setSkillForm(emptySkill);
      setEditing(null);
    }, editing ? "Skill updated." : "Skill added.");

  const saveEducationAction = () =>
    save(async () => {
      await saveItem(
        "education",
        { ...educationForm, order: Number(educationForm.order) },
        editing
      );
      setEducationForm(emptyEducation);
      setEditing(null);
    }, editing ? "Education updated." : "Education added.");

  const saveProjectAction = () =>
    save(async () => {
      await saveItem(
        "projects",
        {
          ...projectForm,
          tools: projectForm.tools.filter(Boolean),
          images: projectForm.images || [],
          order: Number(projectForm.order),
        },
        editing
      );
      setProjectForm(emptyProject);
      setEditing(null);
    }, editing ? "Project updated." : "Project added.");

  const remove = async (collectionName, id, label = "item") => {
    if (!window.confirm(`Delete this ${label}?`)) return;
    await save(async () => {
      await removeItem(collectionName, id);
    }, `${label} deleted.`);
  };

  const renderList = (items, type, editor, label = "item") => (
    <div className="admin-list">
      {items.length === 0 && (
        <p className="helper">No {label}s yet. Add one above.</p>
      )}

      {items.map((item, index) => (
        <div className="admin-list-item" key={item.id || `${type}-${index}`}>
          <div>
            <strong>{item.title || item.name || item.degree || label}</strong>
            <span>
              {item.category || item.institution || item.period || ""}
            </span>
          </div>

          <div className="row-actions">
            <button onClick={() => editor(item)}>Edit</button>
            <button
              className="danger"
              onClick={() => remove(type, item.id, label)}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="dashboard">
      <aside className="admin-sidebar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Kameel Admin</span>
        </div>

        {["profile", "skills", "education", "projects"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            key={x}
            onClick={() => {
              setTab(x);
              setEditing(null);
            }}
          >
            {x}
          </button>
        ))}

        <button className="logout" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="online-dot" /> SYSTEM ONLINE
          </div>
          <span>{user.email}</span>
        </div>

        <div className="admin-content">
          <h1>{tab[0].toUpperCase() + tab.slice(1)}</h1>

          {message && (
            <div className={`admin-message admin-message-${messageType}`}>
              {message}
            </div>
          )}

          {/* ═══════════ PROFILE ═══════════ */}
          {tab === "profile" && (
            <div className="admin-card">
              <div className="photo-upload">
                <div className="admin-photo">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" />
                  ) : (
                    <ImagePlus />
                  )}
                </div>

                <label className="btn btn-dark">
                  Upload Profile Photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhoto(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="resume-upload">
                <div className="resume-badge">
                  <FileText size={22} />
                </div>

                <div className="resume-info">
                  <strong>Resume (PDF)</strong>
                  <span className="helper">
                    {profile.resumeUrl
                      ? "Uploaded — shown as Download button in hero."
                      : "No resume uploaded yet. Max 700 KB."}
                  </span>
                </div>

                <label className="btn btn-dark">
                  Upload Resume
                  <input
                    hidden
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleResume(e.target.files[0])}
                  />
                </label>

                {profile.resumeUrl && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                    onClick={() =>
                      setProfile((p) => ({ ...p, resumeUrl: "" }))
                    }
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <label>
                  Name
                  <input
                    value={profile.name || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </label>

                <label>
                  Email
                  <input
                    value={profile.email || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </label>

                <label>
                  Phone
                  <input
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </label>

                <label>
                  LinkedIn
                  <input
                    value={profile.linkedin || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, linkedin: e.target.value })
                    }
                  />
                </label>

                <label>
                  Location
                  <input
                    value={profile.location || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                  />
                </label>

                <label>
                  Roles (comma separated)
                  <input
                    value={(profile.roles || []).join(", ")}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        roles: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Tagline
                <input
                  value={profile.tagline || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, tagline: e.target.value })
                  }
                />
              </label>

              <label>
                About
                <textarea
                  rows="7"
                  value={profile.about || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, about: e.target.value })
                  }
                />
              </label>

              <button className="btn btn-primary" onClick={saveProfileAction}>
                <Save size={17} /> Save Profile
              </button>
            </div>
          )}

          {/* ═══════════ SKILLS ═══════════ */}
          {tab === "skills" && (
            <>
              <div className="admin-card">
                <div className="form-grid">
                  <label>
                    Skill
                    <input
                      value={skillForm.name}
                      onChange={(e) =>
                        setSkillForm({ ...skillForm, name: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Category
                    <input
                      value={skillForm.category}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          category: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Level %
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skillForm.level}
                      onChange={(e) =>
                        setSkillForm({ ...skillForm, level: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Order
                    <input
                      type="number"
                      value={skillForm.order}
                      onChange={(e) =>
                        setSkillForm({ ...skillForm, order: e.target.value })
                      }
                    />
                  </label>
                </div>

                <button className="btn btn-primary" onClick={saveSkill}>
                  <Plus size={17} /> {editing ? "Update Skill" : "Add Skill"}
                </button>
              </div>

              {renderList(skills, "skills", editSkill, "skill")}
            </>
          )}

          {/* ═══════════ EDUCATION ═══════════ */}
          {tab === "education" && (
            <>
              <div className="admin-card">
                <div className="form-grid">
                  <label>
                    Degree
                    <input
                      value={educationForm.degree}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          degree: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Institution
                    <input
                      value={educationForm.institution}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          institution: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Period
                    <input
                      value={educationForm.period}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          period: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Order
                    <input
                      type="number"
                      value={educationForm.order}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          order: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    value={educationForm.description}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                <button
                  className="btn btn-primary"
                  onClick={saveEducationAction}
                >
                  <Plus size={17} />{" "}
                  {editing ? "Update Education" : "Add Education"}
                </button>
              </div>

              {renderList(education, "education", editEducation, "education")}
            </>
          )}

          {/* ═══════════ PROJECTS ═══════════ */}
          {tab === "projects" && (
            <>
              <div className="admin-card">
                <div className="form-grid">
                  <label>
                    Project title
                    <input
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Category
                    <input
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          category: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Figma URL
                    <input
                      value={projectForm.figmaUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          figmaUrl: e.target.value,
                        })
                      }
                      placeholder="https://www.figma.com/design/..."
                    />
                  </label>

                  <label>
                    Case Study PDF URL
                    <input
                      value={projectForm.pdfUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          pdfUrl: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Live URL
                    <input
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          liveUrl: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Order
                    <input
                      type="number"
                      value={projectForm.order}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          order: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Description
                  <textarea
                    rows="5"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Tools (comma separated)
                  <input
                    value={(projectForm.tools || []).join(", ")}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        tools: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>

                {/* Cover Image */}
                <div className="upload-block">
                  <div className="upload-block-head">
                    <strong>Cover Image</strong>
                    <span className="helper">
                      Shown on the project card. One image.
                    </span>
                  </div>

                  <div className="project-upload-row">
                    <label className="btn btn-dark">
                      Upload Cover
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => projectImage(e.target.files[0])}
                      />
                    </label>

                    {projectForm.image && (
                      <div className="upload-thumb">
                        <img src={projectForm.image} alt="Cover preview" />
                        <button
                          type="button"
                          className="thumb-remove"
                          onClick={() =>
                            setProjectForm((p) => ({ ...p, image: "" }))
                          }
                          aria-label="Remove cover"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Design Gallery */}
                <div className="upload-block">
                  <div className="upload-block-head">
                    <strong>Design Gallery</strong>
                    <span className="helper">
                      All your design shots for this project. Shown as a
                      scrollable carousel in the project modal.
                    </span>
                  </div>

                  <div className="gallery-uploader">
                    <label className="gallery-add">
                      <Plus size={22} />
                      <span>Add Images</span>
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          for (const file of files) {
                            try {
                              const data = await fileToDataUrl(
                                file,
                                500 * 1024
                              );
                              setProjectForm((p) => ({
                                ...p,
                                images: [...(p.images || []), data],
                              }));
                            } catch (err) {
                              showMessage(err.message, "error");
                            }
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {(projectForm.images || []).map((src, i) => (
                      <div
                        className="upload-thumb gallery-thumb"
                        key={`img-${i}`}
                      >
                        <img src={src} alt={`Design ${i + 1}`} />
                        <span className="thumb-index">{i + 1}</span>
                        <button
                          type="button"
                          className="thumb-remove"
                          onClick={() =>
                            setProjectForm((p) => ({
                              ...p,
                              images: (p.images || []).filter(
                                (_, idx) => idx !== i
                              ),
                            }))
                          }
                          aria-label={`Remove image ${i + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {(projectForm.images || []).length > 0 && (
                    <p className="helper">
                      {(projectForm.images || []).length} image
                      {(projectForm.images || []).length === 1 ? "" : "s"} added.
                      Total size must stay under 1 MB — keep each image below
                      200–300 KB.
                    </p>
                  )}
                </div>

                <button className="btn btn-primary" onClick={saveProjectAction}>
                  <Plus size={17} />{" "}
                  {editing ? "Update Project" : "Add Project"}
                </button>
              </div>

              {renderList(projects, "projects", editProject, "project")}
            </>
          )}
        </div>
      </main>
    </div>
  );
}