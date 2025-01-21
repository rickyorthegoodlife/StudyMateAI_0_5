import React, { useState } from 'react'

const Home = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    topic: '',
    text: '',
    studyLevel: 'sixième',
    specialty: '',
    sessionLength: 'courte',
    pdfFile: null
  })

  const [errors, setErrors] = useState({})

  const showSpecialtyField = ['licence1', 'licence2', 'licence3', 'master1', 'master2'].includes(formData.studyLevel)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, pdfFile: file, text: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Le sujet est obligatoire'
    }
    
    if (!formData.pdfFile && formData.text && formData.text.split(' ').length < 150) {
      newErrors.text = 'Le texte doit contenir au moins 150 mots'
    }

    if (showSpecialtyField && !formData.specialty.trim()) {
      newErrors.specialty = 'La spécialité est obligatoire'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const numberOfQuestions = {
        courte: 10,
        moyenne: 15,
        longue: 20
      }[formData.sessionLength]
      
      onSubmit({
        ...formData,
        numberOfQuestions
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Sujet *</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.topic ? 'border-red-500' : ''
            }`}
            placeholder="Entrez un sujet..."
          />
          {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Fichier PDF (optionnel)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {!formData.pdfFile && (
          <div>
            <label className="block text-gray-700 mb-2">Texte (optionnel)</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.text ? 'border-red-500' : ''
              }`}
              rows="6"
              placeholder="Entrez votre texte ici (minimum 150 mots)..."
            />
            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Durée de la session</label>
            <select
              value={formData.sessionLength}
              onChange={(e) => setFormData({ ...formData, sessionLength: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="courte">Courte (5-10 questions)</option>
              <option value="moyenne">Moyenne (10-15 questions)</option>
              <option value="longue">Longue (15-20 questions)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Niveau d'étude</label>
            <select
              value={formData.studyLevel}
              onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sixième">Sixième</option>
              <option value="cinquième">Cinquième</option>
              <option value="quatrième">Quatrième</option>
              <option value="troisième">Troisième</option>
              <option value="seconde">Seconde</option>
              <option value="première">Première</option>
              <option value="terminale">Terminale</option>
              <option value="licence1">Licence 1</option>
              <option value="licence2">Licence 2</option>
              <option value="licence3">Licence 3</option>
              <option value="master1">Master 1</option>
              <option value="master2">Master 2</option>
            </select>
          </div>

          {showSpecialtyField && (
            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">Spécialité *</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.specialty ? 'border-red-500' : ''
                }`}
                placeholder="Entrez votre spécialité..."
              />
              {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Génération en cours...' : 'Générer des questions'}
        </button>
      </div>
    </form>
  )
}

export default Home
