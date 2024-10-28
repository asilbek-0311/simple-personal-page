'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com/yourusername', emoji: '📸' },
  { name: 'Twitter', url: 'https://twitter.com/yourusername', emoji: '🐦' },
  { name: 'GitHub', url: 'https://github.com/yourusername', emoji: '💻' },
  { name: 'Email', url: 'mailto:your.email@example.com', emoji: '📧' },
]

const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML']

export default function Home() {
  const [draggingItem, setDraggingItem] = useState<number | null>(null)
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(
    socialLinks.map(() => ({ x: 0, y: 0 }))
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prevPositions) =>
        prevPositions.map((pos, index) => {
          if (index === draggingItem) return pos
          return {
            x: pos.x,
            y: pos.y + 1 > window.innerHeight ? -50 : pos.y + 1,
          }
        })
      )
    }, 16)

    return () => clearInterval(interval)
  }, [draggingItem])

  const handleMouseDown = (index: number) => () => {
    setDraggingItem(index)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingItem !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPositions((prevPositions) =>
        prevPositions.map((pos, index) =>
          index === draggingItem
            ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
            : pos
        )
      )
    }
  }

  const handleMouseUp = () => {
    setDraggingItem(null)
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.profileImage}>
          <Image src="/profile-picture.jpg" alt="Your Name" width={200} height={200} />
        </div>
        <h1 className={styles.title}>Your Name</h1>
        <p className={styles.subtitle}>Web Developer & Designer</p>
      </section>

      <section className={styles.about}>
        <h2>About Me</h2>
        <p>
          Hello! I am a passionate web developer with a keen eye for design. 
          I love creating beautiful, functional websites that provide great user experiences.
          When I am not coding, you can find me exploring new technologies, reading, or enjoying nature.
        </p>
      </section>

      <section className={styles.skills}>
        <h2>My Skills</h2>
        <ul className={styles.skillList}>
          {skills.map((skill, index) => (
            <li key={index} className={styles.skillItem}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section 
        className={styles.social} 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <h2>Connect with Me</h2>
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className={styles.socialLink}
            style={{
              transform: `translate(${positions[index].x}px, ${positions[index].y}px)`,
              cursor: draggingItem === index ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown(index)}
          >
            <span className={styles.emoji}>{link.emoji}</span>
            <span className={styles.linkText}>{link.name}</span>
          </a>
        ))}
      </section>
    </main>
  )
}