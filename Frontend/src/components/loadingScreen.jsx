import '../loading.css';

const LoadingScreen = ()=>{
  {
    return (
      <div className="redirect-screen">
        <div className="redirect-card">
          <img 
            src={require('../assetss/images/logo.jpg')} 
            alt="Logo" 
            className="redirect-logo"
          />
          <h2>Loading...</h2>
          <h4>Hang tight, setting things up...</h4>
          <div className="redirect-spinner"></div>
        </div>
      </div>
    );
  }
}
export default LoadingScreen