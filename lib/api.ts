// API service functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface InterviewRequest {
  job_description: string
  audio_answer?: File
}

export interface InterviewResponse {
  questions: string[]
  model_answers: string[]
  transcript?: string
  feedback: string
}

export interface TourRequest {
  section: string
}

export interface TourResponse {
  script: string
  audio_url?: string
}

export interface ContactRequest {
  name: string
  email: string
  message: string
  website?: string // honeypot field
  turnstile_token?: string
}

// AI Interview API
export async function generateInterviewQuestions(data: InterviewRequest): Promise<InterviewResponse> {
  const formData = new FormData()
  formData.append("job_description", data.job_description)

  if (data.audio_answer) {
    formData.append("audio_answer", data.audio_answer)
  }

  const response = await fetch(`${API_BASE_URL}/ai/interview/`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to generate interview questions")
  }

  return response.json()
}

// AI Tour API
export async function generateTourScript(data: TourRequest): Promise<TourResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/tour/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to generate tour script")
  }

  return response.json()
}

// Contact API
export async function submitContactForm(data: ContactRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to send message")
  }

  return response.json()
}

// Portfolio API functions
export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/portfolio/projects/`)
  if (!response.ok) throw new Error("Failed to fetch projects")
  return response.json()
}

export async function fetchBlogPosts() {
  const response = await fetch(`${API_BASE_URL}/portfolio/blog/`)
  if (!response.ok) throw new Error("Failed to fetch blog posts")
  return response.json()
}

export async function fetchDocuments() {
  const response = await fetch(`${API_BASE_URL}/portfolio/docs/`)
  if (!response.ok) throw new Error("Failed to fetch documents")
  return response.json()
}

export async function fetchSocialProfiles() {
  const response = await fetch(`${API_BASE_URL}/portfolio/profiles/`)
  if (!response.ok) throw new Error("Failed to fetch social profiles")
  return response.json()
}
