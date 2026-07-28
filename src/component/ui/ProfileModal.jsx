import React, { useEffect, useRef, useState } from "react";
import { X, Star, Camera, Check, Pencil } from "lucide-react";
import { INITIAL_PROFILE } from "../../constants/mockDataUnified";
import { C } from "../../constants/ui";
import { useSelector } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

let FieldRow = React.memo(function FieldRow({
  label,
  value,
  isEditing,
  inputType = "text",
  onChange,
}) {
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
});

export default function ProfileModal({ isModalOpen, onModalClose }) {
  let user = useSelector((state) => state.auth.user);
  let dispatch = useDispatch();
  let [profile, setProfile] = useState(INITIAL_PROFILE);
  let [draft, setDraft] = useState(profile);
  let [isEditing, setIsEditing] = useState(false);
  let [showSuccess, setShowSuccess] = useState(false);
  let backdropRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && user) {
      setDraft({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        avatar: user.image || "",
      });

      setIsEditing(false);
    }
  }, [isModalOpen, user]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;
  if (!profile) return null;

  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) {
      handleCancel();
      onModalClose();
    }
  }

  function handleStartEdit() {
    setDraft({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      avatar: user.image || "",
    });

    setIsEditing(true);
  }

  function handleCancel() {
    setDraft({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      avatar: user.image || "",
    });
    setIsEditing(false);
  }

  async function handleSave() {
    try {
      let formData = new FormData();

      formData.append("name", draft.name);
      formData.append("phone", draft.phone);
      formData.append("location", draft.location);

      if (draft.image) {
        formData.append("userImage", draft.image);
      }

      let response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/auth/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      dispatch(setUser(response.data.user));

      setIsEditing(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err.response.data);
    }
  }

  function handleAvatarChange(e) {
    let file = e.target.files?.[0];
    if (!file) return;

    setDraft((d) => ({
      ...d,
      image: file,
    }));

    let reader = new FileReader();
    reader.onload = (ev) => {
      setDraft((d) => ({
        ...d,
        avatar: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  }
  let avatarSrc = draft.avatar?.startsWith("data:")
    ? draft.avatar
    : `${import.meta.env.VITE_SERVER_URL}/userProfile/${user.image}`;

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
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: C.muted,
          }}
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
                  {isEditing ? draft.name.charAt(0) : user.name.charAt(0)}
                </span>
              )}
            </div>

            {isEditing && (
              <label
                className="absolute inset-0 rounded-full flex items-center justify-center transition"
                style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}
                aria-label="Change profile photo"
              >
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  name="userImage"
                />
              </label>
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
                {user.name}
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
            value={isEditing ? draft.email : user.email}
            isEditing={isEditing}
            inputType="email"
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
          />
          <FieldRow
            label="Phone"
            value={isEditing ? draft.phone : user.phone}
            isEditing={isEditing}
            inputType="tel"
            onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
          />
          <FieldRow
            label="Location"
            value={isEditing ? draft.location : user.location}
            isEditing={isEditing}
            onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
          />
          <FieldRow
            label="Member Since"
            value={new Date(user.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            isEditing={false}
            onChange={() => {}}
          />
        </div>

        <div className="px-6 pb-6">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition bg-white/10 hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${C.cardBorder}`,
                  color: C.muted,
                }}
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

          {showSuccess && (
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
