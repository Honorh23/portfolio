"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  Upload,
  Mic,
  MicOff,
  Brain,
  CheckCircle,
  RotateCcw,
  Target,
  Lightbulb,
  FileText,
  MessageSquare,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  Play,
  Pause,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JobAnalysis {
  role: string
  company: string
  keySkills: string[]
  requirements: string[]
  difficulty: "entry" | "mid" | "senior"
  industry: string
}

interface InterviewQuestion {
  id: string
  question: string
  type: "technical" | "behavioral" | "situational" | "company-specific"
  difficulty: "easy" | "medium" | "hard"
  modelAnswer: string
  tips: string[]
  followUpQuestions?: string[]
}

interface AnswerFeedback {
  score: number
  strengths: string[]
  improvements: string[]
  grade: "A" | "B" | "C" | "D" | "F"
  detailedFeedback: string
}

interface InterviewSession {
  questions: InterviewQuestion[]
  currentQuestionIndex: number
  userAnswers: { [key: string]: { text: string; audio?: Blob } }
  feedback: { [key: string]: AnswerFeedback }
  overallScore?: number
}

// Mock AI responses for demonstration
const generateMockAnalysis = (jobDescription: string): JobAnalysis => {
  return {
    role: "Full Stack Developer",
    company: "Tech Startup",
    keySkills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
    requirements: ["3+ years experience", "Bachelor's degree", "Strong problem-solving skills"],
    difficulty: "mid",
    industry: "Technology",
  }
}

const generateMockQuestions = (analysis: JobAnalysis): InterviewQuestion[] => {
  return [
    {
      id: "1",
      question: "Tell me about yourself and why you're interested in this Full Stack Developer position.",
      type: "behavioral",
      difficulty: "easy",
      modelAnswer:
        "I'm a passionate full-stack developer with 3+ years of experience building scalable web applications. I specialize in React and Node.js, and I'm particularly drawn to this role because it combines my technical skills with the opportunity to work on innovative projects in a fast-paced startup environment.",
      tips: [
        "Keep it concise (2-3 minutes)",
        "Focus on relevant experience",
        "Connect your background to the role",
        "Show enthusiasm for the company",
      ],
    },
    {
      id: "2",
      question: "How would you optimize a React application that's experiencing performance issues?",
      type: "technical",
      difficulty: "medium",
      modelAnswer:
        "I'd start by profiling the app using React DevTools to identify bottlenecks. Common optimizations include: implementing React.memo for component memoization, using useMemo and useCallback for expensive calculations, code splitting with lazy loading, optimizing bundle size, and implementing virtual scrolling for large lists.",
      tips: [
        "Mention specific tools and techniques",
        "Explain your debugging process",
        "Discuss both immediate and long-term solutions",
        "Consider user experience impact",
      ],
      followUpQuestions: [
        "What tools would you use to measure performance?",
        "How do you handle state management in large applications?",
      ],
    },
    {
      id: "3",
      question: "Describe a challenging project you worked on and how you overcame the obstacles.",
      type: "situational",
      difficulty: "medium",
      modelAnswer:
        "I worked on a real-time chat application that needed to handle 10,000+ concurrent users. The main challenge was managing WebSocket connections efficiently. I implemented connection pooling, message queuing with Redis, and horizontal scaling with load balancers. The key was breaking down the problem and testing each solution incrementally.",
      tips: [
        "Use the STAR method (Situation, Task, Action, Result)",
        "Focus on your problem-solving process",
        "Highlight technical skills used",
        "Quantify the impact when possible",
      ],
    },
  ]
}

export function AIInterview() {
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [activeTab, setActiveTab] = useState("analysis")
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const handleAnalyzeJob = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const jobAnalysis = generateMockAnalysis(jobDescription)
      const questions = generateMockQuestions(jobAnalysis)

      setAnalysis(jobAnalysis)
      setSession({
        questions,
        currentQuestionIndex: 0,
        userAnswers: {},
        feedback: {},
      })

      setActiveTab("interview")

      toast({
        title: "Success",
        description: "Job analysis complete! Ready to start your interview prep.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      toast({
        title: "Recording Started",
        description: "Speak your answer clearly. Click stop when finished.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const playRecordedAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlayingAudio(true)

      audioRef.current.onended = () => {
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const handleAnswerSubmit = async () => {
    if (!session || (!currentAnswer.trim() && !audioBlob)) return

    const currentQuestion = session.questions[session.currentQuestionIndex]

    // Save answer with audio
    const updatedAnswers = {
      ...session.userAnswers,
      [currentQuestion.id]: {
        text: currentAnswer,
        audio: audioBlob || undefined,
      },
    }

    // Generate AI feedback (mock implementation)
    const feedback = generateAnswerFeedback(currentAnswer, currentQuestion)
    const updatedFeedback = {
      ...session.feedback,
      [currentQuestion.id]: feedback,
    }

    setSession({
      ...session,
      userAnswers: updatedAnswers,
      feedback: updatedFeedback,
    })

    setCurrentAnswer("")
    setAudioBlob(null)

    toast({
      title: "Answer Submitted",
      description: `Your answer has been graded: ${feedback.grade}. Check the Results tab for detailed feedback.`,
    })

    // Auto-switch to results tab if this was the last question
    if (session.currentQuestionIndex === session.questions.length - 1) {
      setActiveTab("results")
    }
  }

  const generateAnswerFeedback = (answer: string, question: InterviewQuestion): AnswerFeedback => {
    // Mock AI grading logic
    const wordCount = answer.trim().split(/\s+/).length
    const hasKeywords = question.modelAnswer
      .toLowerCase()
      .split(" ")
      .some((word) => answer.toLowerCase().includes(word) && word.length > 3)

    let score = 0
    const strengths: string[] = []
    const improvements: string[] = []

    // Basic scoring logic
    if (wordCount >= 50) {
      score += 30
      strengths.push("Good answer length and detail")
    } else {
      improvements.push("Provide more detailed explanations")
    }

    if (hasKeywords) {
      score += 40
      strengths.push("Used relevant technical terminology")
    } else {
      improvements.push("Include more specific technical details")
    }

    if (answer.includes("example") || answer.includes("experience")) {
      score += 20
      strengths.push("Provided concrete examples")
    } else {
      improvements.push("Add specific examples from your experience")
    }

    // Random additional points for demonstration
    score += Math.floor(Math.random() * 10)

    const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F"

    const detailedFeedback = `Your answer demonstrates ${score >= 80 ? "strong" : score >= 60 ? "adequate" : "basic"} understanding of the topic. ${strengths.length > 0 ? "Key strengths include: " + strengths.join(", ") + "." : ""} ${improvements.length > 0 ? "Areas for improvement: " + improvements.join(", ") + "." : ""}`

    return {
      score,
      strengths,
      improvements,
      grade,
      detailedFeedback,
    }
  }

  const calculateOverallScore = () => {
    if (!session || Object.keys(session.feedback).length === 0) return 0
    const scores = Object.values(session.feedback).map((f) => f.score)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const navigateQuestion = (direction: "next" | "prev") => {
    if (!session) return

    const newIndex =
      direction === "next"
        ? Math.min(session.currentQuestionIndex + 1, session.questions.length - 1)
        : Math.max(session.currentQuestionIndex - 1, 0)

    setSession({
      ...session,
      currentQuestionIndex: newIndex,
    })

    setCurrentAnswer(session.userAnswers[session.questions[newIndex].id]?.text || "")
    setAudioBlob(session.userAnswers[session.questions[newIndex].id]?.audio || null)
  }

  const resetSession = () => {
    setSession(null)
    setAnalysis(null)
    setJobDescription("")
    setCurrentAnswer("")
    setAudioBlob(null)
    setActiveTab("analysis")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "behavioral":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "situational":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "company-specific":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const currentQuestion = session?.questions[session.currentQuestionIndex]
  const progress = session ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100 : 0
  const currentQuestionAnswer = session?.userAnswers[currentQuestion?.id || ""]
  const overallScore = calculateOverallScore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-4">AI Interview Prep</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Paste any job description and get personalized interview questions, model answers, and expert tips to ace your
          next interview
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="interview" disabled={!session} className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Interview
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!session} className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Description Input */}
            <Card className="glass border-gradient">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <Upload className="h-5 w-5 mr-2" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyzeJob} className="space-y-4">
                  <Textarea
                    placeholder="Paste the complete job description here... Include role title, requirements, responsibilities, and company information for best results."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Job Description...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze & Generate Questions
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Job Analysis Results */}
            <Card className="glass border-gradient">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <Target className="h-5 w-5 mr-2" />
                  Job Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysis ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Enter a job description to get detailed analysis and personalized interview questions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Role & Company</h3>
                      <p className="text-lg font-medium text-primary">{analysis.role}</p>
                      <p className="text-muted-foreground">{analysis.company}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Key Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keySkills.map((skill) => (
                          <Badge key={skill} className="bg-primary/10 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
                      <ul className="space-y-1">
                        {analysis.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-sm text-muted-foreground">Difficulty Level</span>
                        <Badge className={`ml-2 ${getDifficultyColor(analysis.difficulty)}`}>
                          {analysis.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Industry</span>
                        <Badge variant="outline" className="ml-2">
                          {analysis.industry}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interview" className="space-y-8">
          {session && (
            <>
              {/* Progress Bar */}
              <Card className="glass border-gradient">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Question */}
                <Card className="glass border-gradient">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gradient">Interview Question</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(currentQuestion?.type || "")}>
                          {currentQuestion?.type.replace("-", " ").toUpperCase()}
                        </Badge>
                        <Badge className={getDifficultyColor(currentQuestion?.difficulty || "")}>
                          {currentQuestion?.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-lg font-medium text-foreground">{currentQuestion?.question}</p>
                    </div>

                    {/* Answer Input */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Your Answer</h3>
                        <div className="flex items-center gap-2">
                          {!isRecording ? (
                            <Button variant="outline" size="sm" onClick={startRecording}>
                              <Mic className="h-4 w-4 mr-1" />
                              Record
                            </Button>
                          ) : (
                            <Button variant="destructive" size="sm" onClick={stopRecording}>
                              <MicOff className="h-4 w-4 mr-1" />
                              Stop Recording
                            </Button>
                          )}
                          {audioBlob && (
                            <Button variant="outline" size="sm" onClick={playRecordedAudio} disabled={isPlayingAudio}>
                              {isPlayingAudio ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                              {isPlayingAudio ? "Playing..." : "Play"}
                            </Button>
                          )}
                          {audioBlob && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Audio Recorded
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Textarea
                        placeholder="Type your answer here or use voice recording..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleAnswerSubmit}
                          disabled={!currentAnswer.trim() && !audioBlob}
                          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit & Grade Answer
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateQuestion("prev")}
                            disabled={session.currentQuestionIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateQuestion("next")}
                            disabled={session.currentQuestionIndex === session.questions.length - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Show saved answer */}
                      {currentQuestionAnswer && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground">Your Submitted Answer</h4>
                            {session.feedback[currentQuestion?.id || ""] && (
                              <Badge
                                className={`${
                                  session.feedback[currentQuestion?.id || ""].grade === "A"
                                    ? "bg-green-100 text-green-800"
                                    : session.feedback[currentQuestion?.id || ""].grade === "B"
                                      ? "bg-blue-100 text-blue-800"
                                      : session.feedback[currentQuestion?.id || ""].grade === "C"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                Grade: {session.feedback[currentQuestion?.id || ""].grade}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{currentQuestionAnswer.text}</p>
                          {currentQuestionAnswer.audio && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Mic className="h-3 w-3 mr-1" />
                                Audio answer recorded
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <audio ref={audioRef} className="hidden" />
                  </CardContent>
                </Card>

                {/* Model Answer & Tips */}
                <Card className="glass border-gradient">
                  <CardHeader>
                    <CardTitle className="text-gradient">Model Answer & Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center">
                        <Star className="h-4 w-4 text-primary mr-2" />
                        Model Answer
                      </h3>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm text-foreground leading-relaxed">{currentQuestion?.modelAnswer}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center">
                        <Lightbulb className="h-4 w-4 text-accent mr-2" />
                        Expert Tips
                      </h3>
                      <ul className="space-y-2">
                        {currentQuestion?.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {currentQuestion?.followUpQuestions && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Potential Follow-up Questions</h3>
                        <ul className="space-y-1">
                          {currentQuestion.followUpQuestions.map((followUp, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {followUp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <Button variant="outline" onClick={resetSession} className="hover:bg-destructive/10 bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start New Session
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-8">
          {session && Object.keys(session.feedback).length > 0 && (
            <>
              {/* Overall Performance */}
              <Card className="glass border-gradient">
                <CardHeader>
                  <CardTitle className="text-gradient flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{overallScore}%</div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-accent mb-2">{Object.keys(session.feedback).length}</div>
                      <p className="text-sm text-muted-foreground">Questions Answered</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-secondary mb-2">
                        {Object.values(session.feedback).filter((f) => f.grade === "A" || f.grade === "B").length}
                      </div>
                      <p className="text-sm text-muted-foreground">Strong Answers</p>
                    </div>
                  </div>
                  <Progress value={overallScore} className="mt-6 h-3" />
                </CardContent>
              </Card>

              {/* Individual Question Results */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gradient">Question-by-Question Feedback</h3>
                {session.questions.map((question, index) => {
                  const feedback = session.feedback[question.id]
                  if (!feedback) return null

                  return (
                    <Card key={question.id} className="glass border-gradient">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${
                                feedback.grade === "A"
                                  ? "bg-green-100 text-green-800"
                                  : feedback.grade === "B"
                                    ? "bg-blue-100 text-blue-800"
                                    : feedback.grade === "C"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {feedback.grade}
                            </Badge>
                            <Badge variant="outline">{feedback.score}%</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{question.question}</p>

                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm">{feedback.detailedFeedback}</p>
                        </div>

                        {feedback.strengths.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Strengths
                            </h4>
                            <ul className="text-sm space-y-1">
                              {feedback.strengths.map((strength, i) => (
                                <li key={i} className="text-muted-foreground">
                                  • {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedback.improvements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-amber-600 mb-2 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-1" />
                              Areas for Improvement
                            </h4>
                            <ul className="text-sm space-y-1">
                              {feedback.improvements.map((improvement, i) => (
                                <li key={i} className="text-muted-foreground">
                                  • {improvement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tips" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* General Tips */}
            <Card className="glass border-gradient">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  General Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Research the company thoroughly before the interview
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Practice the STAR method for behavioral questions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Prepare thoughtful questions to ask the interviewer
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Arrive 10-15 minutes early for the interview
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Technical Tips */}
            <Card className="glass border-gradient">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Technical Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Think out loud during coding challenges
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Ask clarifying questions before starting
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Discuss time and space complexity
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Consider edge cases and error handling
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Day of Interview */}
            <Card className="glass border-gradient">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Day of Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Get a good night's sleep before the interview
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Dress appropriately for the company culture
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Bring multiple copies of your resume
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    Stay calm and be yourself
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card className="glass border-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Practice your answers out loud multiple times. This helps with confidence
                  and ensures your responses flow naturally during the actual interview.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
