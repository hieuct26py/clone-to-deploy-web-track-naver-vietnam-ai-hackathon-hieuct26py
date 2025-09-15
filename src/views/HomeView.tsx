import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppState'
import { CameraIcon, PencilIcon } from '../assets/icons'

export function HomeView() {
  const { tasks } = useApp()
  const [name, setName] = useState<string>('Student')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nv_profile')
      if (raw) {
        const p = JSON.parse(raw)
        if (p.name) setName(p.name)
        if (p.avatar) setAvatar(p.avatar)
      }
    } catch {}
  }, [])

  const saveProfile = (n = name, a = avatar) => {
    localStorage.setItem('nv_profile', JSON.stringify({ name: n, avatar: a }))
  }

  const onPickAvatar = () => fileRef.current?.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = String(reader.result || '')
      setAvatar(data)
      saveProfile(name, data)
    }
    reader.readAsDataURL(f)
  }

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || 'U'

  return (
    <section>
      <div className="home-hero">
        <div className="home-avatar" onClick={onPickAvatar} title="Change avatar">
          {avatar ? (
            <img className="avatar-img" src={avatar} alt="avatar" />
          ) : (
            <div className="avatar-fallback">{initials}</div>
          )}
          <div className="avatar-edit"><CameraIcon /></div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
        </div>

        <div className="home-name-row">
          {editingName ? (
            <input
              className="text-input big"
              style={{ textAlign: 'center' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => { setEditingName(false); saveProfile() }}
              onKeyDown={(e) => { if (e.key === 'Enter') { (e.currentTarget as HTMLInputElement).blur() } }}
              autoFocus
            />
          ) : (
            <div className="home-name" onClick={() => setEditingName(true)}>
              Hello, {name}
              <button className="icon-btn soft" aria-label="Edit name" onClick={() => setEditingName(true)}><PencilIcon /></button>
            </div>
          )}
        </div>

        <div className="home-slogan">Học đều mỗi ngày — tiến bộ mỗi giờ.</div>

        <div className="home-slogan-new">Trên con đường thành công không có dấu chân của kẻ lười biếng.</div>
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-num">{tasks.filter((t)=>!t.completed).length}</div>
            <div className="stat-label">Tasks Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{tasks.filter((t)=>t.completed).length}</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// (home hero only) no task sorting needed here
