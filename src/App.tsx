import './App.css'
import FAQ from './components/FAQ/FAQ'
import Footer from './components/Footer/Footer'
import Form from './components/Form/Form'
import Header from './components/Header/Header'
import Results from './components/Results/Results'
import RiseupBanner from './components/RiseupBanner/RiseupBanner'

function App() {
  return (
    <div className="container">
      <Header />
      <Form />
      <Results />
      <RiseupBanner />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
