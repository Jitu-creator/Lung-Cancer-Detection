import './App.scss';
import logo  from './logo.svg';
 

const footer =()=>{
    return(
      
<div id="c1" class="text-center">
<footer class="footer mt-auto mt-4  bg-body-tertiary py-4">
    <div class="row">
      <div class="col-6 col-md-2 mb-3">
        <h5>Section</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Home</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Features</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Pricing</a></li>
        </ul>
      </div>

      <div class="col-6 col-md-2 mb-3">
        <h5>Section</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Home</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Features</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Pricing</a></li>
        </ul>
      </div>

      <div class="col-6 col-md-2 mb-3">
        <h5>Section</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Home</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Features</a></li>
          <li class="nav-item mb-2"><a href="#" class="px-2 text-light">Pricing</a></li>
        </ul>
      </div>

      <div class="col-md-5 offset-md-1 mb-3">
        <form>
          <h5>dugc</h5>
          <p>catch any updates by Subscribing</p>
          <div class="d-flex flex-column flex-sm-row w-100 gap-2">
            <label for="newsletter1" class="visually-hidden">Email address</label>
            <input 
             id="newsletter1" type="email" class="form-control" placeholder="Email address"/>
            <button class="nav-op btn" type="button">Subscribe</button>
          </div>
        </form>
      </div>
    </div>

    <div class="c2">
      <p>&copy;2022 KLE Technological University. All rights reserved.</p>
      <a aria-label="Angular on twitter" target="_blank" rel="noopener"  href="https://twitter.com/KLETechbvb" title="Twitter">
        <svg id="twitter-logo" height="24" data-name="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          {/* <rect width="400" height="400" fill="none"/> */}
          <path d="M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23" fill="#fff"/>
        </svg>
      </a>
      <a aria-label="Angular on YouTube" target="_blank" rel="noopener" href="https://www.youtube.com/c/KLETechnologicalUniversity" title="YouTube">
        <svg id="youtube-logo" height="24" width="24" data-name="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
          {/* <path d="M0 0h24v24H0V0z" fill="none"/> */}
          <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
        </svg>
      </a>
      
      <a aria-label="Facebook"  target="_blank" rel="noopener" href="https://www.facebook.com/kletechbvb/" title="facebook">
        <svg id="facebook" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v6h3v-6h1.82l.18-2h-2v-.833c0-.478.096-.667.558-.667h1.442v-2.5h-2.404c-1.798 0-2.596.792-2.596 2.308v1.692z"/>
        </svg>
      </a>
     
      <a title="Linkedin" href="https://www.linkedin.com/school/kletechbvb/" target="_blank" class="linkedin">
        <svg  id="linkdin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z"/></svg>
      </a>
    </div>
  </footer>
  </div>
    );
}
export default footer;

