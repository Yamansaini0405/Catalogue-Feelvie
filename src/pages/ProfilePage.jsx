import { Copy, ExternalLink, ImagePlus, ShieldCheck, Sparkles, Trash2, UserCircle2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deleteMyBanner, getMyBanner, getMyProfile, uploadMyBanner } from '../api/auth.api'
import { Badge, Button, Card, EmptyState, LoadingBlock, PageHeader } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { formatDate } from '../utils/format'

const CATALOG_BASE_URL = 'https://catalogue.feelvie.com'

function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-slate-900">{value || '—'}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { token } = useAuth()
  const toast = useToast()
  const bannerInputRef = useRef(null)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bannerSaving, setBannerSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!token) {
      setError('Please login to view your profile')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [profileData, bannerData] = await Promise.all([
        getMyProfile(token),
        getMyBanner(token).catch(() => null),
      ])
      setProfile({ ...profileData, ...(bannerData ?? {}) })
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const shareableUrl = useMemo(() => {
    if (!profile?.public_slug) return ''
    return `${CATALOG_BASE_URL}/${profile.public_slug}`
  }, [profile?.public_slug])

  const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()

  const copyShareableUrl = async () => {
    if (!shareableUrl) return
    try {
      await navigator.clipboard.writeText(shareableUrl)
      toast.success('Shareable link copied')
    } catch {
      toast.error('Unable to copy link')
    }
  }

  const openShareableUrl = () => {
    if (!shareableUrl) return
    window.open(shareableUrl, '_blank', 'noopener,noreferrer')
  }

  const openBannerPicker = () => {
    bannerInputRef.current?.click()
  }

  const handleBannerFileChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !token) return

    setBannerSaving(true)
    try {
      await uploadMyBanner(token, file)
      toast.success('Banner updated successfully')
      await loadProfile()
    } catch (requestError) {
      toast.error(requestError?.message ?? 'Unable to upload banner')
    } finally {
      setBannerSaving(false)
    }
  }

  const handleDeleteBanner = async (event) => {
    event.stopPropagation()
    if (!token) return

    setBannerSaving(true)
    try {
      await deleteMyBanner(token)
      toast.success('Banner removed')
      await loadProfile()
    } catch (requestError) {
      toast.error(requestError?.message ?? 'Unable to remove banner')
    } finally {
      setBannerSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Profile"
        description="Account details and your public catalogue presence"
      />

      {loading && <LoadingBlock label="Loading profile…" />}

      {!loading && error && (
        <EmptyState
          icon={UserCircle2}
          title="Couldn't load profile"
          description={error}
        />
      )}

      {!loading && !error && profile && (
        <div className="space-y-6">
          <Card className="overflow-hidden p-0">
            <div
              role="button"
              tabIndex={0}
              onClick={openBannerPicker}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openBannerPicker()
                }
              }}
              className="group relative cursor-pointer"
            >
              <div className="h-56 w-full bg-slate-100 sm:h-64">
                {profile?.banner_url ? (
                  <img
                    src={profile.banner_url}
                    alt="Public banner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-200 via-slate-100 to-brand-50">
                    <div className="flex flex-col items-center gap-3 text-center text-slate-500">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
                        <ImagePlus size={28} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Click to upload banner</p>
                        <p className="mt-1 text-xs text-slate-500">Recommended for your public shareable URL</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 text-white sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-white/90">
                    <Sparkles size={16} />
                    <p className="text-xs font-semibold uppercase tracking-wide">Public banner</p>
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">Banner for your catalogue link</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                    Upload a wide banner that will represent your public shareable page at the top of the storefront.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
                  <Button
                    type="button"
                    variant="secondary"
                    icon={ImagePlus}
                    onClick={openBannerPicker}
                    loading={bannerSaving}
                  >
                    {profile.banner_url ? 'Change banner' : 'Upload banner'}
                  </Button>
                  {profile.banner_url && (
                    <Button
                      type="button"
                      variant="danger"
                      icon={Trash2}
                      onClick={handleDeleteBanner}
                      loading={bannerSaving}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerFileChange}
            />
          </Card>

          <Card className="border-2 border-gold-200 bg-linear-to-br from-gold-50 via-white to-brand-50">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-gold-600">
                  <Sparkles size={16} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Shareable storefront URL</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Your unique catalogue link</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This is the public address you can share with customers. It is tied to your <span className="font-semibold">public_slug</span> and should stay unique to your account.
                </p>

                <div className="mt-4 rounded-2xl border border-gold-200 bg-white p-4 shadow-soft">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Public URL</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1 rounded-xl border border-dashed border-gold-300 bg-gold-50 px-4 py-3">
                      <p className="truncate font-mono text-sm font-semibold text-slate-900">
                        {shareableUrl || 'Not generated yet'}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        icon={Copy}
                        onClick={copyShareableUrl}
                        disabled={!shareableUrl}
                      >
                        Copy
                      </Button>
                      <Button
                        type="button"
                        variant="dark"
                        icon={ExternalLink}
                        onClick={openShareableUrl}
                        disabled={!shareableUrl}
                      >
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-soft lg:w-72">
                <div className="flex items-center gap-2 text-brand-700">
                  <ShieldCheck size={16} />
                  <p className="text-sm font-semibold">Account status</p>
                </div>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Role</span>
                    <span className="font-semibold text-slate-900">{profile.role || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Verification</span>
                    <span className="font-semibold text-slate-900">{profile.is_verified ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Public profile</span>
                    <span className="font-semibold text-slate-900">{profile.public_slug ? 'Enabled' : 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="relative">
              <div className="h-28 bg-linear-to-r from-brand-700 via-brand-600 to-gold-500 sm:h-36" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div className="flex items-end gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-soft sm:h-24 sm:w-24">
                    {profile?.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt={fullName || profile.email}
                        className="h-full w-full rounded-[18px] object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-brand-50 text-brand-700">
                        <UserCircle2 size={40} />
                      </div>
                    )}
                  </div>
                  <div className="pb-1 text-white drop-shadow-sm">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{fullName || '—'}</h2>
                    <p className="mt-1 text-sm text-white/90">{profile.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge tone={profile.role === 'admin' ? 'brand' : 'neutral'}>
                    {profile.role || 'member'}
                  </Badge>
                  <Badge tone={profile.is_verified ? 'success' : 'warning'}>
                    {profile.is_verified ? 'Verified' : 'Not verified'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 pb-5 pt-16 sm:grid-cols-2 sm:px-6 sm:pt-18 lg:grid-cols-3">
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Phone" value={profile.phone} />
              <ProfileField label="Joined on" value={formatDate(profile.date_joined)} />
              <ProfileField label="Referral code" value={profile.referral_code} />
              <ProfileField label="Public slug" value={profile.public_slug} />
              <ProfileField label="User ID" value={profile.id} />
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && !profile && (
        <EmptyState icon={UserCircle2} title="No profile data" description="No account details were returned from the server." />
      )}
    </section>
  )
}
