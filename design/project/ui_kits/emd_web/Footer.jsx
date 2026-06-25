// Footer.jsx — copyright + legal links
function Footer() {
  return (
    <footer className="emd-footer">
      <div className="emd-footer-inner">
        <p>© {new Date().getFullYear()} Ease My Disease. All rights reserved.</p>
        <nav className="emd-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">HIPAA Notice</a>
        </nav>
      </div>
    </footer>
  );
}

window.Footer = Footer;
