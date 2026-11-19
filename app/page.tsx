import { UserRound } from "lucide-react"

import { MessageComposer } from "@/components/wall/message-composer"
import { PostFeed } from "@/components/wall/post-feed"

export default function Home() {
  return (
    <main className="wall-page">
      <div className="wall-shell">
        <header className="wall-topbar">
          <span className="wall-topbar-title">wall</span>
        </header>

        <div className="wall-layout">
          <aside className="wall-sidebar" aria-label="Profile information">
            <div
              className="wall-profile-placeholder"
              role="img"
              aria-label="Profile photo placeholder"
            >
              <UserRound aria-hidden="true" className="size-24 stroke-[1.25] sm:size-32" />
              <span>Profile photo coming soon</span>
            </div>

            <h1 id="profile-name" className="wall-profile-name">
              Greg Wientjes
            </h1>
            <p className="wall-profile-label">wall</p>

            <section className="wall-info-card">
              <h2 className="wall-info-heading">About</h2>
              <dl className="wall-info-list">
                <div>
                  <dt>Networks</dt>
                  <dd>Stanford Alum</dd>
                </div>
                <div>
                  <dt>Current City</dt>
                  <dd>Palo Alto, CA</dd>
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
