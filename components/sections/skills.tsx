import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Skills() {
  const skillCategories = [
    {
      title: "Backend Development",
      skills: [
        { name: "Python", level: 95 },
        { name: "Django", level: 90 },
        { name: "FastAPI", level: 85 },
        { name: "PostgreSQL", level: 85 },
      ],
    },
    {
      title: "Frontend & Integration",
      skills: [
        { name: "React", level: 80 },
        { name: "TypeScript", level: 75 },
        { name: "Tailwind CSS", level: 85 },
        { name: "REST APIs", level: 90 },
      ],
    },
    {
      title: "AI & Tools",
      skills: [
        { name: "OpenAI API", level: 80 },
        { name: "Docker", level: 75 },
        { name: "Redis", level: 70 },
        { name: "WebSockets", level: 80 },
      ],
    },
  ]

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Skills & Expertise</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My technical skills span backend development, AI integration, and modern web technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
