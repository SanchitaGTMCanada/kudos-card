"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [designation, setDesignation] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  function getInitials(name) {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
  }

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/auth/me",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load profile"
        );
      }

      setUser(result.user);
      setDesignation(
        result.user.designation || ""
      );
      setProfileImage(
        result.user.profileImage || ""
      );
    } catch (error) {
      console.error(
        "Profile load error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave() {
    setError("");
    setSuccess("");

    if (designation.trim().length > 100) {
      setError(
        "Designation cannot exceed 100 characters."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            designation:
              designation.trim(),
            profileImage:
              profileImage.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update profile"
        );
      }

      setUser(result.user);
      setDesignation(
        result.user.designation || ""
      );
      setProfileImage(
        result.user.profileImage || ""
      );

      setSuccess(
        "Profile updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Image size cannot exceed 2 MB."
      );

      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/profile/image",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to upload profile image"
        );
      }

      setUser(result.user);

      setProfileImage(
        result.user.profileImage || ""
      );

      setSuccess(
        "Profile image updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload profile image"
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    setError("");
    setSuccess("");

    if (!profileImage) return;

    setUploadingImage(true);

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            designation:
              designation.trim(),
            profileImage: "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to remove profile image"
        );
      }

      setUser(result.user);
      setProfileImage("");

      setSuccess(
        "Profile image removed successfully."
      );
    } catch (error) {
      console.error(
        "Remove profile image error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove profile image"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleChangePassword() {
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword.length > 100) {
      setError(
        "New password cannot exceed 100 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        "/api/profile/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to change password"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(
        "Password changed successfully. Please log in again with your new password."
      );

      setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 1800);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F8FC]">
        <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-36 rounded bg-[#E9EBF0]" />

            <div className="mt-8 h-10 w-48 rounded bg-[#E9EBF0]" />

            <div className="mt-8 h-[700px] rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#18212F]">
            Unable to load profile
          </h1>

          <Link
            href="/login"
            className="mt-4 inline-flex rounded-xl bg-[#5B3CC4] px-5 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const initials = getInitials(user.name);

  return (
    <main className="min-h-screen bg-[#F7F8FC]">

      {/* Header */}

      <header className="border-b border-[#E8EAF0] bg-white">
        <div className="mx-auto flex h-[80px] max-w-[900px] items-center px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#70798A] transition hover:text-[#5B3CC4]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}

      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">

        {/* Heading */}

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B3CC4]">
            <User size={13} />
            Employee Profile
          </div>

          <h1 className="text-[36px] font-bold tracking-[-0.04em] text-[#18212F]">
            My Profile
          </h1>

          <p className="mt-2 text-[15px] leading-7 text-[#70798A]">
            Manage your profile information and
            account security.
          </p>
        </div>

        {/* Success */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#CDEBDD] bg-[#EEF9F5] px-4 py-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-[#2C9A72]"
            />

            <p className="text-sm font-semibold text-[#2C9A72]">
              {success}
            </p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Profile Card */}

        <section className="overflow-hidden rounded-3xl border border-[#E8EAF0] bg-white shadow-sm">

          {/* Profile Header */}

          <div className="relative overflow-hidden border-b border-[#EEF0F4] px-7 py-8 sm:px-9">

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#EDE7FF] blur-3xl" />

            <div className="relative flex flex-col items-center gap-5 sm:flex-row">

              {/* Profile Image */}

              <div className="relative">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name}
                    className="h-24 w-24 rounded-3xl object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#E9E1FF] text-2xl font-bold text-[#5B3CC4]">
                    {initials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploadingImage ||
                    changingPassword
                  }
                  aria-label="Change profile image"
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-white bg-[#5B3CC4] text-white shadow-sm transition hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={15} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name */}

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#18212F]">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-[#70798A]">
                  {designation || "Employee"}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF9F5] px-3 py-1.5 text-xs font-bold text-[#2C9A72]">
                    <CheckCircle2 size={14} />
                    {user.status === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                  </div>

                  {uploadingImage && (
                    <span className="text-xs font-medium text-[#8A92A2]">
                      Uploading...
                    </span>
                  )}
                </div>

                {profileImage &&
                  !uploadingImage && (
                    <button
                      type="button"
                      onClick={
                        handleRemoveImage
                      }
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D45568] transition hover:text-[#B94055]"
                    >
                      <X size={14} />
                      Remove photo
                    </button>
                  )}
              </div>
            </div>

            <p className="relative mt-5 text-center text-xs text-[#9BA3B0] sm:text-left">
              JPG, PNG or WebP · Maximum 2 MB
            </p>
          </div>

          {/* Edit Profile */}

          <div className="p-7 sm:p-9">

            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.08em] text-[#8A92A2]">
              Edit Profile
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18212F]">
                  Full Name
                </label>

                <div className="flex h-12 items-center rounded-xl border border-[#E8EAF0] bg-[#F7F8FC] px-4">
                  <User
                    size={17}
                    className="mr-3 text-[#9BA3B0]"
                  />

                  <span className="text-sm font-medium text-[#70798A]">
                    {user.name}
                  </span>
                </div>
              </div>

              {/* Employee ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18212F]">
                  Employee ID
                </label>

                <div className="flex h-12 items-center rounded-xl border border-[#E8EAF0] bg-[#F7F8FC] px-4">
                  <ShieldCheck
                    size={17}
                    className="mr-3 text-[#9BA3B0]"
                  />

                  <span className="text-sm font-medium text-[#70798A]">
                    {user.employeeId}
                  </span>
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18212F]">
                  Email Address
                </label>

                <div className="flex h-12 items-center rounded-xl border border-[#E8EAF0] bg-[#F7F8FC] px-4">
                  <Mail
                    size={17}
                    className="mr-3 text-[#9BA3B0]"
                  />

                  <span className="truncate text-sm font-medium text-[#70798A]">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Department */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#18212F]">
                  Department
                </label>

                <div className="flex h-12 items-center rounded-xl border border-[#E8EAF0] bg-[#F7F8FC] px-4">
                  <Building2
                    size={17}
                    className="mr-3 text-[#9BA3B0]"
                  />

                  <span className="text-sm font-medium text-[#70798A]">
                    {user.department?.name ||
                      "Not assigned"}
                  </span>
                </div>
              </div>

              {/* Designation */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="designation"
                  className="mb-2 block text-sm font-semibold text-[#18212F]"
                >
                  Designation
                </label>

                <div className="relative">
                  <BriefcaseBusiness
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="designation"
                    type="text"
                    value={designation}
                    onChange={(event) =>
                      setDesignation(
                        event.target.value
                      )
                    }
                    maxLength={100}
                    placeholder="Enter your designation"
                    disabled={
                      saving ||
                      changingPassword
                    }
                    className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="mt-1.5 flex justify-end">
                  <span className="text-[11px] text-[#A4ABB6]">
                    {designation.length}/100
                  </span>
                </div>
              </div>

              {/* Image URL */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="profileImage"
                  className="mb-2 block text-sm font-semibold text-[#18212F]"
                >
                  Profile Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="profileImage"
                    type="url"
                    value={profileImage}
                    onChange={(event) =>
                      setProfileImage(
                        event.target.value
                      )
                    }
                    maxLength={500}
                    placeholder="https://example.com/profile.jpg"
                    disabled={
                      saving ||
                      changingPassword
                    }
                    className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-4 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <p className="mt-2 text-[11px] text-[#A4ABB6]">
                  You can upload a photo using the
                  button above or use a public image
                  URL.
                </p>
              </div>
            </div>

            {/* Save */}

            <div className="mt-8 flex justify-end border-t border-[#EEF0F4] pt-7">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  uploadingImage ||
                  changingPassword
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#5B3CC4] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(91,60,196,0.18)] transition hover:bg-[#4D32AD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Change Password */}

          <div className="border-t border-[#EEF0F4] bg-[#FAFAFC] p-7 sm:p-9">

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFF]">
                  <LockKeyhole
                    size={18}
                    className="text-[#5B3CC4]"
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#18212F]">
                    Change Password
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8A92A2]">
                    Keep your account secure with a strong password.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              {/* Current Password */}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-semibold text-[#18212F]"
                >
                  Current Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter current password"
                    disabled={
                      changingPassword
                    }
                    className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-12 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8A92A2] hover:text-[#5B3CC4]"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-[#18212F]"
                >
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter new password"
                    disabled={
                      changingPassword
                    }
                    className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-12 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8A92A2] hover:text-[#5B3CC4]"
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[11px] text-[#9BA3B0]">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#18212F]"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9BA3B0]"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    disabled={
                      changingPassword
                    }
                    className="h-12 w-full rounded-xl border border-[#E2E5EB] bg-white pl-11 pr-12 text-sm text-[#18212F] outline-none transition placeholder:text-[#A4ABB6] focus:border-[#5B3CC4] focus:ring-4 focus:ring-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8A92A2] hover:text-[#5B3CC4]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Change Password Button */}

              <div className="flex justify-end border-t border-[#E8EAF0] pt-6">
                <button
                  type="button"
                  onClick={
                    handleChangePassword
                  }
                  disabled={
                    changingPassword ||
                    saving ||
                    uploadingImage
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#5B3CC4] bg-white px-6 text-sm font-bold text-[#5B3CC4] transition hover:bg-[#F1EEFF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LockKeyhole size={17} />

                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </div>
            </div>
          </div>

          {/* Account Details */}

          <div className="border-t border-[#EEF0F4] bg-white p-7 sm:p-9">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.08em] text-[#8A92A2]">
              Account Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-[#EEF0F4] bg-[#FAFAFC] p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFF]">
                  <ShieldCheck
                    size={18}
                    className="text-[#5B3CC4]"
                  />
                </div>

                <p className="text-xs font-medium text-[#9BA3B0]">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-bold text-[#18212F]">
                  {user.role === "ADMIN"
                    ? "Administrator"
                    : "Employee"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#EEF0F4] bg-[#FAFAFC] p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF9F5]">
                  <CheckCircle2
                    size={18}
                    className="text-[#2C9A72]"
                  />
                </div>

                <p className="text-xs font-medium text-[#9BA3B0]">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-bold text-[#18212F]">
                  {user.status === "ACTIVE"
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}