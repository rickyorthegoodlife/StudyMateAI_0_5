import React, { useState } from 'react'
import Home from './Home'
import Quiz from './Quiz'
import Results from './Results'
import { generateQuestionsFromText, generateQuestionsFromPDF } from './geminiService'

const App = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)

  const generateQuestions = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      let questions
      if (formData.pdfFile) {
        questions = await generateQuestionsFromPDF(
          formData.pdfFile,
          formData.topic,
          formData.studyLevel,
          formData.numberOfQuestions
        )
      } else {
        questions = await generateQuestionsFromText(
          formData.topic,
          formData.text,
          formData.studyLevel,
          formData.numberOfQuestions
        )
      }
      
      setQuestions(questions)
      setCurrentQuestionIndex(0)
      setUserAnswers(new Array(questions.length).fill(null))
      setShowResults(false)
    } catch (err) {
      setError('Erreur lors de la génération des questions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          StudyMate AI
        </h1>
        <p className="text-xl text-gray-600 font-medium">
          Votre compagnon pour des révisions intelligentes
        </p>
      </div>

      {questions.length === 0 ? (
        <Home onSubmit={generateQuestions} loading={loading} />
      ) : showResults ? (
        <Results 
          questions={questions}
          userAnswers={userAnswers}
          onRestart={() => {
            setQuestions([])
            setUserAnswers([])
            setShowResults(false)
          }}
        />
      ) : (
        <Quiz
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswer={(index) => {
            const newAnswers = [...userAnswers]
            newAnswers[currentQuestionIndex] = index
            setUserAnswers(newAnswers)
          }}
          onNext={() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1)
            }
          }}
          onSubmit={() => setShowResults(true)}
        />
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  )
}

export default App
