import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="hover:scale-105 transition-transform inline-block">
              <Logo className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Track your nutrition with AI-powered food analysis
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-all hover:translate-x-1 inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-all hover:translate-x-1 inline-block">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-all hover:translate-x-1 inline-block">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">Guides</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2024 FoodSnap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 