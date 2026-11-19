import { MessageComposer } from "@/components/wall/message-composer"
import { PostFeed } from "@/components/wall/post-feed"
import { ProfilePhoto } from "@/components/wall/profile-photo"

export default function Home() {
  return (
    <main className="wall-page">
      <div className="wall-shell">
        <header className="wall-topbar">
          <span className="wall-topbar-title">Wall</span>
        </header>

        <div className="wall-layout">
          <aside className="wall-sidebar" aria-label="Profile information">
            <ProfilePhoto />

            <h1 id="profile-name" className="wall-profile-name">
              Jovaney Agda
            </h1>
            <p className="wall-profile-label">wall</p>

            <section className="wall-info-card">
              <h2 className="wall-info-heading">About</h2>
              <dl className="wall-info-list">
                <div>
                  <dt>Networks</dt>
                  <dd>Eastern Samar State University</dd>
                </div>
                <div>
                  <dt>Current City</dt>
                  <dd>City of Borongan, Eastern Samar</dd>
                </div>
              </dl>
            </section>
          </aside>

          <section className="wall-content" aria-label="Wall posts">
            <MessageComposer />
            <PostFeed />
          </section>
        </div>
      </div>
    </main>
  )
}
