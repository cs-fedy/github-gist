import { LogoutButton } from "@/features/logout/LogoutButton";
import {
  Github,
  Search,
  Plus,
  Star,
  GitFork,
  Eye,
  Lock,
  Globe,
  Code,
  User,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Github className="h-8 w-8 text-gray-900" />
                <span className="text-xl font-semibold text-gray-900">
                  GitHub
                </span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Your gists
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  All gists
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Starred
                </a>
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search gists..."
                  className="pl-10 w-64 bg-gray-50 border-gray-300 focus:bg-white"
                />
              </div>
              <Link
                to="/create"
                className={cn(
                  buttonVariants(),
                  "bg-green-600 hover:bg-green-700 text-white"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                New gist
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  All Gists
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Starred
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort: Recently created
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">
                Instantly share code, notes, and snippets.
              </p>
            </div>

            {/* Gist List */}
            <div className="space-y-4">
              {/* Sample Gist 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        react-hooks-example.js
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Public</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  A collection of useful React hooks for common use cases
                  including useLocalStorage, useDebounce, and useAsync.
                </p>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      react-hooks-example.js
                    </span>
                    <Code className="h-4 w-4 text-gray-400" />
                  </div>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    <code>{`import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  // ... rest of implementation`}</code>
                  </pre>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>12</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>3</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>45</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Star
                    </Button>
                    <Button variant="outline" size="sm">
                      <GitFork className="h-4 w-4 mr-1" />
                      Fork
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Gist 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        css-grid-layouts.css
                      </h3>
                      <p className="text-sm text-gray-600">Created 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Secret</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Modern CSS Grid layouts for responsive web design. Includes
                  common patterns like sidebar, header-footer, and card grids.
                </p>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      css-grid-layouts.css
                    </span>
                    <Code className="h-4 w-4 text-gray-400" />
                  </div>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    <code>{`.container {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header {
  grid-column: 1 / -1;
  background: #f8f9fa;
  padding: 1rem;
}`}</code>
                  </pre>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>8</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>2</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>23</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Star
                    </Button>
                    <Button variant="outline" size="sm">
                      <GitFork className="h-4 w-4 mr-1" />
                      Fork
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Gist 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        python-data-analysis.py
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created 3 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Public</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Python script for analyzing CSV data with pandas. Includes
                  data cleaning, visualization, and statistical analysis
                  functions.
                </p>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      python-data-analysis.py
                    </span>
                    <Code className="h-4 w-4 text-gray-400" />
                  </div>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    <code>{`import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_data(file_path):
    # Load and clean data
    df = pd.read_csv(file_path)
    df = df.dropna()
    
    # Generate summary statistics
    summary = df.describe()
    return summary`}</code>
                  </pre>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>25</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>7</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>89</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Star
                    </Button>
                    <Button variant="outline" size="sm">
                      <GitFork className="h-4 w-4 mr-1" />
                      Fork
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" className="px-8">
                Load more gists
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create new gist
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Search all gists
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    View starred gists
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Created{" "}
                        <span className="font-medium">
                          react-hooks-example.js
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Starred{" "}
                        <span className="font-medium">awesome-css-tricks</span>
                      </p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Forked <span className="font-medium">python-utils</span>
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Your Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total gists</span>
                    <span className="font-medium text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Public gists</span>
                    <span className="font-medium text-gray-900">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Secret gists</span>
                    <span className="font-medium text-gray-900">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Stars received
                    </span>
                    <span className="font-medium text-gray-900">127</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Customer stories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Developer API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Atom
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Electron
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Community Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Professional Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Skills
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Github className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">© 2024 GitHub, Inc.</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900">
                Security
              </a>
              <a href="#" className="hover:text-gray-900">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
