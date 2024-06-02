import 'bootstrap-icons/font/bootstrap-icons.css'

const Footer: React.FC = () => {
  return (
    <footer className='bg-light text-black py-3 text-start'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-9'>
            <h5>StoryStash</h5>
            <p>
              Bara en förstaårselev som landar the best of both worlds, webbutveckling och böcker.
            </p>
          </div>

          <div className='col-md-3 d-flex flex-column align-items-start'>
            <div className='row'>
              <div className='col mx-2'>
                <h5>Connecta med mig!</h5>
                <a href='https://github.com/aliciaosv' className='text-dark mx-5' style={{ fontSize: '1.2rem' }} aria-label='Github'>
                  <i className="bi bi-github" />
                </a>
                <a href='https://www.linkedin.com/in/sirialicia-gustafsson/' className='text-dark mx-2' style={{ fontSize: '1.2rem' }} aria-label='LinkedIn'>
                  <i className="bi bi-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  </footer>
  )
}

export default Footer
