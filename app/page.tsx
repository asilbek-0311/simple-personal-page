'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com/asilbek_0311', emoji: '📸' },
  { name: 'Twitter', url: 'https://twitter.com/asil_beck', emoji: '🐦' },
  { name: 'GitHub', url: 'https://github.com/asilbek-0311', emoji: '💻' },
  { name: 'Email', url: 'mailto:azizjonogliasilbek@gmail.com', emoji: '📧' },
]

const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS', 'HTML', 'Solidity', 'Git', 'Figma', 'Next.js', 'C', 'Python']

const emojis = ['🚀', '💡', '🌈', '🎨', '🔧', '🌟', '🎉', '🔥']

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [draggingItem, setDraggingItem] = useState<number | null>(null)
  const [positions, setPositions] = useState<{ x: number; y: number; emoji: string; settled: boolean }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const initialPositions = Array.from({ length: 20 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * -500,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      settled: false,
    }))
    setPositions(initialPositions)

    const interval = setInterval(() => {
      setPositions((prevPositions) =>
        prevPositions.map((pos, index) => {
          // Don't move if being dragged or already settled
          if (index === draggingItem || pos.settled) return pos
    
          const containerHeight = containerRef.current?.getBoundingClientRect().height || window.innerHeight
          const newY = pos.y + 2 // Faster falling speed
    
          // Check if emoji should settle at the bottom
          if (newY > containerHeight - 50) {
            return {
              ...pos,
              y: containerHeight - 50,
              settled: true
            }
          }
    
          return {
            ...pos,
            y: newY
          }
        })
      )
    }, 16)

    return () => clearInterval(interval)
  }, [draggingItem])

  useEffect(() => {
    const moveGlow = () => {
      setGlowPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }
    const glowInterval = setInterval(moveGlow, 2000)
    return () => clearInterval(glowInterval)
  }, [])

  const handleMouseDown = (index: number) => () => {
    setDraggingItem(index)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingItem !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPositions((prevPositions) =>
        prevPositions.map((pos, index) =>
          index === draggingItem
            ? { 
                ...pos, 
                x: e.clientX - rect.left, 
                y: Math.min(e.clientY - rect.top, rect.height - 50) // Added this limit
              }
            : pos
        )
      )
    }
  }

  const handleMouseUp = () => {
    setDraggingItem(null)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <main className={`${styles.main} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.emojiBackground} ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {positions.map((pos, index) => (
          <div
            key={index}
            className={styles.floatingEmoji}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              cursor: draggingItem === index ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown(index)}
          >
            {pos.emoji}
          </div>
        ))}
      </div>
      <button onClick={toggleDarkMode} className={styles.darkModeToggle}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <section className={styles.hero}>
        <div className={styles.profileImage}>
          <Image src="/sticker.webp" alt="Asilbek" width={200} height={200} />
        </div>
        <h1 className={styles.title}>Asilbek Abdullaev</h1>
        <p className={styles.subtitle}>CS student</p>
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} className={styles.socialLink}>
              <span className={styles.emoji}>{link.emoji}</span>
              <span className={styles.linkText}>{link.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.about}>
        <h2>About Me</h2>
        <p>
          Hello! I&apos;m a passionate web developer with a keen eye for design. 
          I love creating beautiful, functional websites that provide great user experiences.
          When I&apos;m not coding, you can find me exploring new technologies, reading, or enjoying nature.
        </p>
      </section>

      <section className={styles.skills}>
        <h2>My Skills</h2>
        <ul className={styles.skillList}>
          {skills.map((skill, index) => (
            <li key={index} className={styles.skillItem} style={{
              '--glow-x': `${glowPosition.x}%`,
              '--glow-y': `${glowPosition.y}%`,
            } as React.CSSProperties}>
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}