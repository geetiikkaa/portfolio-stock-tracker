import { useEffect, useRef, useState } from "react";
import { X, Star, Camera, Check, Pencil } from "lucide-react";
import { INITIAL_PROFILE } from "../../constants/mockDataUnified";

const C = {
  bgTop: "#0B0F1D",
  bgBottom: "#060810",
  card: "#11162A",
  cardBorder: "rgba(255,255,255,0.06)",
  cardBorderFocus: "rgba(140,124,246,0.5)",
  text: "#F3F5FB",
  muted: "#8A91A8",
  mutedSoft: "#6B7286",
  green: "#34D6A0",
  greenSoft: "rgba(52,214,160,0.14)",
  purple: "#8C7CF6",
  purpleSoft: "rgba(140,124,246,0.12)",
  red: "#F0716B",
  blue: "#5B72F0",
  orange: "#F5A623",
  orangeSoft: "rgba(245,166,35,0.14)",
};

function FieldRow({ label, value, isEditing, inputType = "text", onChange }) {
  return (
    <div>
      <div className="text-xs mb-1" style={{ color: C.muted }}>
        {label}
      </div>
      {isEditing && label !== "Member Since" ? (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none transition"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.cardBorderFocus}`,
            color: C.text,
          }}
        />
      ) : (
        <div className="text-sm font-medium" style={{ color: C.text }}>
          {value}
        </div>
      )}
    </div>
  );
}

export default function ProfileModal({ isModalOpen, onModalClose }) {
  let [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const backdropRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      setDraft(profile);
      setIsEditing(false);
    }
  }, [isModalOpen, profile]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) {
      handleCancel();
      onModalClose();
    }
  }

  function handleStartEdit() {
    setDraft({ ...profile });
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft({ ...profile });
    setIsEditing(false);
  }

  function handleSave() {
    setProfile({ ...draft });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({ ...d, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  const avatarSrc = isEditing ? draft.avatar : profile.avatar;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,7,18,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-xs mx-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 40%), #11162A",
          border: `1px solid ${C.cardBorder}`,
          borderRadius: "24px",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 60px -20px rgba(0,0,0,0.8)",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

        <button
          onClick={() => {
            handleCancel();
            onModalClose();
          }}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full transition"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: C.muted,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
          }
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="flex items-center pt-8 pb-5 px-6 justify-around">
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.08)",
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {(isEditing ? draft.name : profile.name).slice(0, 1)}
                </span>
              )}
            </div>

            {isEditing && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 rounded-full flex items-center justify-center transition"
                  style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}
                  aria-label="Change profile photo"
                >
                  <Camera size={18} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          <div className="flex flex-col">
            {isEditing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="text-center text-base font-bold rounded-lg px-3 py-1.5 outline-none mb-2 w-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${C.cardBorderFocus}`,
                  color: C.text,
                }}
              />
            ) : (
              <div
                className="text-base font-bold mb-2"
                style={{ color: C.text }}
              >
                {profile.name}
              </div>
            )}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: C.orangeSoft, color: C.orange }}
            >
              <Star size={11} fill={C.orange} strokeWidth={0} />
              {profile.plan}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: C.cardBorder, marginBottom: 0 }} />

        <div className="flex flex-col gap-4 px-6 py-5">
          <FieldRow
            label="Email"
            value={isEditing ? draft.email : profile.email}
            isEditing={isEditing}
            inputType="email"
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
          />
          <FieldRow
            label="Phone"
            value={isEditing ? draft.phone : profile.phone}
            isEditing={isEditing}
            inputType="tel"
            onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
          />
          <FieldRow
            label="Location"
            value={isEditing ? draft.location : profile.location}
            isEditing={isEditing}
            onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
          />
          <FieldRow
            label="Member Since"
            value={profile.memberSince}
            isEditing={false}
            onChange={() => {}}
          />
        </div>

        <div className="px-6 pb-6">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.muted,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{
                  background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                  color: "#fff",
                  boxShadow: `0 4px 18px -6px ${C.purple}80`,
                }}
              >
                <Check size={15} />
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
              style={{
                background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                color: "#fff",
                boxShadow: `0 4px 18px -6px ${C.purple}80`,
              }}
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          )}

          {saved && (
            <div
              className="mt-3 text-center text-xs font-medium rounded-lg py-1.5"
              style={{
                background: C.greenSoft,
                color: C.green,
              }}
            >
              ✓ Profile updated successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
