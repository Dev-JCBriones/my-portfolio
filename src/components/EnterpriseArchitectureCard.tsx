import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Copy, Check, Code2, 
  Sparkles, Filter, ChevronRight, Mail, Terminal, Layers, Eye, FileCode, Database, Cpu
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  status: string;
  avatar: string;
  bio: string;
}

// Sample User Dataset for the UI Response preview
const INITIAL_USERS: User[] = [
  { id: 1, name: 'Alex Rivera', role: 'Developer', email: 'alex.rivera@dev.io', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', bio: 'Full-stack PHP (Laravel) & React Specialist with 5 years experience.' },
  { id: 2, name: 'Beatriz Cruz', role: 'Designer', email: 'beatriz.c@design.co', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', bio: 'UI/UX enthusiast focused on minimalist web design systems.' },
  { id: 3, name: 'Carlos Santos', role: 'Manager', email: 'carlos.s@techcorp.com', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', bio: 'Engineering manager connecting frontend and backend teams.' },
  { id: 4, name: 'Dianne Tan', role: 'Developer', email: 'dianne.dev@code.net', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', bio: 'Backend expert specializing in Eloquent ORM & Query Scopes.' },
  { id: 5, name: 'Ethan Reyes', role: 'Designer', email: 'ethan.r@studio.io', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', bio: 'Design system architect obsessed with grid layouts.' },
  { id: 6, name: 'Fiona Garcia', role: 'Manager', email: 'fiona.g@agile.org', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250', bio: 'Product manager focusing on high-converting client UX.' }
];

interface PhpFile {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  language: string;
  code: string;
}

// Professional Clean PHP Code Files
const PHP_FILES: Record<string, PhpFile> = {
  controller: {
    name: 'UserController.php',
    icon: FileCode,
    language: 'php',
    code: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Resources\\UserResource;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\AnonymousResourceCollection;

class UserController extends Controller
{
    /**
     * Search and filter users dynamically with clean Architecture.
     *
     * @param  Request  $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $users = User::query()
            ->search($request->input('q'))
            ->filterByRole($request->input('role'))
            ->filterByStatus($request->input('status'))
            ->latest()
            ->paginate(15);

        return UserResource::collection($users);
    }
}`
  },
  model: {
    name: 'User.php',
    icon: Cpu,
    language: 'php',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'role',
        'status',
        'avatar',
        'bio',
    ];

    /**
     * Scope query to search across Name or Email using indexed LIKE matching.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        return $query->when($term, function (Builder $q) use ($term) {
            $q->where(function (Builder $sub) use ($term) {
                $sub->where('name', 'LIKE', "%{$term}%")
                    ->orWhere('email', 'LIKE', "%{$term}%");
            });
        });
    }

    /**
     * Scope query to filter users by specific Role.
     */
    public function scopeFilterByRole(Builder $query, ?string $role): Builder
    {
        return $query->when($role && $role !== 'All', fn (Builder $q) => $q->where('role', $role));
    }

    /**
     * Scope query to filter users by Status (Active / Inactive).
     */
    public function scopeFilterByStatus(Builder $query, ?string $status): Builder
    {
        return $query->when($status && $status !== 'All', fn (Builder $q) => $q->where('status', $status));
    }
}`
  },
  resource: {
    name: 'UserResource.php',
    icon: Layers,
    language: 'php',
    code: `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource entity into a sanitized JSON response array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'role'       => $this->role,
            'status'     => $this->status,
            'avatar'     => $this->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->name),
            'bio'        => $this->bio,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}`
  },
  schema: {
    name: 'schema.sql',
    icon: Database,
    language: 'sql',
    code: `-- Enterprise Database Schema with Proper Query Indexing

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`role\` ENUM('Developer', 'Designer', 'Manager') NOT NULL DEFAULT 'Developer',
  \`status\` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  \`avatar\` VARCHAR(255) NULL,
  \`bio\` TEXT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Optimized indexes for fast search filtering
  INDEX \`idx_users_search\` (\`name\`, \`email\`),
  INDEX \`idx_users_filters\` (\`role\`, \`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed initial test dataset
INSERT INTO \`users\` (\`name\`, \`email\`, \`role\`, \`status\`, \`avatar\`, \`bio\`) VALUES
('Alex Rivera', 'alex.rivera@dev.io', 'Developer', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'Full-stack PHP & React Specialist'),
('Beatriz Cruz', 'beatriz.c@design.co', 'Designer', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'UI/UX enthusiast'),
('Carlos Santos', 'carlos.s@techcorp.com', 'Manager', 'Inactive', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Engineering manager');`
  }
};

export const EnterpriseArchitectureCard: React.FC = () => {
  const { playSound, showToast } = useTheme();
  const [activeTab, setActiveTab] = useState<'code' | 'explanation' | 'ui'>('code');
  const [selectedFile, setSelectedFile] = useState<string>('controller');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredUsers = useMemo(() => {
    return INITIAL_USERS.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  const handleCopyCode = () => {
    playSound('pop');
    const currentCode = PHP_FILES[selectedFile]?.code || '';
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    showToast('PHP code copied to clipboard!', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentFileObj = PHP_FILES[selectedFile] || PHP_FILES.controller;

  return (
    <div className="mt-8 rounded-[24px] sm:rounded-[28px] bg-[#0E0E0E] text-[#FAF7F3] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[640px]">
      
      {/* Terminal Window Header Bar */}
      <div className="px-5 py-3.5 bg-[#141414] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-3 font-mono text-xs text-white/50 hidden sm:inline-flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            {activeTab === 'code' ? currentFileObj.name : activeTab === 'explanation' ? 'Architecture_Overview.md' : 'Live_API_Response.json'}
          </span>
        </div>

        {/* 3 Main Tabs with Framer Motion layoutId Gliding Pill */}
        <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-white/10 text-xs gap-1 relative">
          {[
            { id: 'code', label: 'PHP Code', icon: Code2 },
            { id: 'explanation', label: 'Logic Breakdown', icon: Layers },
            { id: 'ui', label: 'UI Response', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { playSound('click'); setActiveTab(tab.id as any); }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-[#111111] font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMainTabPill"
                    className="absolute inset-0 bg-white rounded-lg shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#111111]' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area with Smooth AnimatePresence Transitions */}
      <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* ================= TAB 1: ENTERPRISE PHP CODE ================= */}
          {activeTab === 'code' && (
            <motion.div
              key="tab-code"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              {/* Sub-File Bar with layoutId Gliding Pill */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#121212] border-b border-white/10 text-xs shrink-0 overflow-x-auto">
                <div className="flex items-center gap-1 relative">
                  {Object.keys(PHP_FILES).map((fileKey) => {
                    const file = PHP_FILES[fileKey];
                    const Icon = file.icon;
                    const isActive = selectedFile === fileKey;
                    return (
                      <button
                        key={fileKey}
                        onClick={() => { playSound('click'); setSelectedFile(fileKey); }}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-mono text-[11px] whitespace-nowrap cursor-pointer ${
                          isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activePhpFilePill"
                            className="absolute inset-0 bg-white/15 border border-white/10 rounded-lg shadow-sm"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-indigo-400' : 'text-white/40'}`} />
                        <span className="relative z-10">{file.name}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors border border-white/10 ml-2 shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Syntax Highlighted Code Viewer with Smooth File Transition */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 select-text relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFile}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <pre className="whitespace-pre-wrap">
                      {currentFileObj.code.split('\n').map((line: string, idx: number) => (
                        <div key={idx} className="table-row">
                          <span className="table-cell text-white/30 select-none pr-4 text-right w-8">{idx + 1}</span>
                          <span className="table-cell">
                            {line.trim().startsWith('<?php') || line.trim().startsWith('?>') ? (
                              <span className="text-rose-400 font-bold">{line}</span>
                            ) : line.trim().startsWith('*') || line.trim().startsWith('/*') || line.trim().startsWith('//') || line.trim().startsWith('--') ? (
                              <span className="text-white/40 italic">{line}</span>
                            ) : (
                              <span>
                                {line
                                  .replace(/\b(namespace|use|class|extends|public|function|return|protected|use|trait)\b/g, '___KEY___$1___END___')
                                  .replace(/\b(Builder|Request|AnonymousResourceCollection|JsonResource|Authenticatable|HasFactory|User|UserResource)\b/g, '___TYPE___$1___END___')
                                  .replace(/\b(CREATE TABLE|PRIMARY KEY|AUTO_INCREMENT|NOT NULL|UNIQUE|DEFAULT|INDEX|ENGINE|CHARSET|INSERT INTO|VALUES)\b/g, '___SQL___$1___END___')
                                  .split(/(___KEY___.*?___END___|___TYPE___.*?___END___|___SQL___.*?___END___)/g)
                                  .map((part: string, pIdx: number) => {
                                    if (part.startsWith('___KEY___')) {
                                      return <span key={pIdx} className="text-purple-400 font-semibold">{part.replace(/___KEY___|___END___/g, '')}</span>;
                                    }
                                    if (part.startsWith('___TYPE___')) {
                                      return <span key={pIdx} className="text-amber-400 font-medium">{part.replace(/___TYPE___|___END___/g, '')}</span>;
                                    }
                                    if (part.startsWith('___SQL___')) {
                                      return <span key={pIdx} className="text-cyan-400 font-bold">{part.replace(/___SQL___|___END___/g, '')}</span>;
                                    }
                                    return part;
                                  })}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </pre>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: ARCHITECTURE LOGIC BREAKDOWN ================= */}
          {activeTab === 'explanation' && (
            <motion.div
              key="tab-explanation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 p-6 sm:p-8 overflow-y-auto space-y-5 text-sm text-white/80"
            >
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                  <Terminal className="w-5 h-5 text-indigo-400" /> Professional Clean Architecture Standards
                </h3>
                <p className="text-xs text-white/60">
                  Clean and scalable backend structure engineered for high-performance enterprise applications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                  <p className="font-semibold text-indigo-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    1. Controller (Single Responsibility)
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    <code className="text-indigo-300">UserController.php</code> is lean with no raw SQL statements or cumbersome blocks, delegating queries cleanly to model scopes.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                  <p className="font-semibold text-purple-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    2. Query Scopes (Model Layer)
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Search and filtering logic is cleanly isolated in <code className="text-purple-300">User.php</code> using reusable Eloquent Query Scopes.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                  <p className="font-semibold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    3. API Resource Transformer Layer
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    <code className="text-emerald-300">UserResource.php</code> transforms database entities into sanitized JSON responses while hiding internal attributes.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                  <p className="font-semibold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    4. Indexed MySQL Database Schema
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Database schema is indexed on search and filter columns (`name`, `email`, `role`, `status`) for lightning-fast execution.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 3: DYNAMIC LIVE UI RESPONSE ================= */}
          {activeTab === 'ui' && (
            <motion.div
              key="tab-ui"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col overflow-hidden"
            >
              {/* Search & Filter Top Bar */}
              <div className="p-4 border-b border-white/10 bg-[#121212] space-y-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search user by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <span className="px-3 py-1.5 bg-white/10 text-emerald-400 text-xs font-mono font-medium rounded-lg border border-white/10 shrink-0">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                  </span>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-white/50 flex items-center gap-1 mr-1">
                      <Filter className="w-3 h-3 text-white/40" /> Role:
                    </span>
                    {['All', 'Developer', 'Designer', 'Manager'].map((role) => (
                      <button
                        key={role}
                        onClick={() => { playSound('click'); setSelectedRole(role); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedRole === role
                            ? 'bg-white text-[#111111] font-semibold'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-white/70 ml-auto">
                    <span className="text-white/40">Status:</span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-white/5 text-white text-xs border border-white/10 rounded-lg px-2 py-1 outline-none cursor-pointer"
                    >
                      <option value="All" className="bg-[#181818] text-white">All Status</option>
                      <option value="Active" className="bg-[#181818] text-white">Active</option>
                      <option value="Inactive" className="bg-[#181818] text-white">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Cards List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => { playSound('click'); setSelectedUser(user); }}
                        className={`group cursor-pointer rounded-xl p-3 border transition-all duration-200 flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-white/15 border-white/30 shadow-lg'
                            : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-white/30 transition-all"
                            />
                            <span 
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${
                                user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                                {user.name}
                              </h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                user.role === 'Developer' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                                user.role === 'Designer' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                                'bg-amber-500/10 text-amber-300 border-amber-500/20'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-xs text-white/50 truncate flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-white/40" /> {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded ${
                            user.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 bg-white/5'
                          }`}>
                            {user.status}
                          </span>
                          <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'group-hover:text-white/70'}`} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">No users found</h3>
                    <p className="text-xs text-white/50 max-w-xs mt-1">
                      Try adjusting your search query or filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedRole('All');
                        setSelectedStatus('All');
                      }}
                      className="mt-4 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* User Selected Detail Modal Footer */}
              {selectedUser && (
                <div className="p-3.5 bg-[#141414] border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={selectedUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{selectedUser.name}</p>
                      <p className="text-[11px] text-white/60 truncate">{selectedUser.bio}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-2.5 py-1 text-xs text-white/70 hover:text-white bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#141414] border-t border-white/10 px-4 py-2.5 text-xs text-white/50 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Enterprise Laravel Architecture Ready
        </span>
        <span className="font-mono text-[11px] text-white/40">PHP 8.2+ • Eloquent ORM • REST API</span>
      </div>
    </div>
  );
};
