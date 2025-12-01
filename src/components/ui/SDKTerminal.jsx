import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderOpen, Lock, Zap, BarChart3, CheckCircle2, ChevronRight } from 'lucide-react';

const SDKTerminal = () => {
  const [history, setHistory] = useState([
    { 
      command: '', 
      output: `Welcome to CypherRay SDK Interactive Demo
Type 'help' to see available commands.`,
      type: 'system'
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const npmInstallOutput = `
added 12 packages, and audited 13 packages in 2s

3 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities

[✓] @cypherray/sdk installed successfully
[✓] Binary analysis tools configured
[✓] Ready to scan firmware binaries
`;

  const scanOutput = [
    { text: '[>] Scanning firmware binaries...', delay: 0, icon: 'search' },
    { text: '', delay: 400 },
    { text: '[~] Found 3 binary files:', delay: 800, icon: 'folder' },
    { text: '   → firmware_v1.bin', delay: 1000 },
    { text: '   → bootloader.elf', delay: 1200 },
    { text: '   → app_image.hex', delay: 1400 },
    { text: '', delay: 1600 },
    { text: '[*] Analyzing firmware_v1.bin...', delay: 2000, icon: 'lock' },
    { text: '   [✓] File hash: a3f5c8d9e2b1...', delay: 2400 },
    { text: '   [✓] Uploading to CypherRay Cloud...', delay: 2800 },
    { text: '   [✓] Starting AI analysis...', delay: 3200 },
    { text: '', delay: 3400 },
    { text: '[!] Analysis Results:', delay: 3800, icon: 'zap' },
    { text: '   → Detected Algorithms: AES-256, RSA-2048, SHA-256', delay: 4000 },
    { text: '   → Vulnerabilities: 2 Medium, 0 High', delay: 4200 },
    { text: '   → Security Score: 78/100', delay: 4400 },
    { text: '', delay: 4600 },
    { text: '[*] Analyzing bootloader.elf...', delay: 5000, icon: 'lock' },
    { text: '   [✓] File hash: b7e4d2f1c9a8...', delay: 5400 },
    { text: '   [✓] Cached result found!', delay: 5800 },
    { text: '   → Credits: 0 (cached)', delay: 6000 },
    { text: '', delay: 6200 },
    { text: '[*] Analyzing app_image.hex...', delay: 6600, icon: 'lock' },
    { text: '   [✓] File hash: c9d8e7f6a5b4...', delay: 7000 },
    { text: '   [✓] Uploading to CypherRay Cloud...', delay: 7400 },
    { text: '   [✓] Starting AI analysis...', delay: 7800 },
    { text: '', delay: 8000 },
    { text: '[!] Analysis Results:', delay: 8400, icon: 'zap' },
    { text: '   → Detected Algorithms: DES (Weak!), MD5 (Deprecated)', delay: 8600 },
    { text: '   → Vulnerabilities: 1 High, 3 Medium', delay: 8800 },
    { text: '   → Security Score: 45/100', delay: 9000 },
    { text: '', delay: 9200 },
    { text: '[#] Summary:', delay: 9600, icon: 'chart' },
    { text: '   Total Files Scanned: 3', delay: 9800 },
    { text: '   Total Credits Used: 12', delay: 9900 },
    { text: '   Critical Issues: 1', delay: 10000 },
    { text: '   Recommendations: Update app_image.hex encryption', delay: 10100 },
    { text: '', delay: 10200 },
    { text: '[✓] Scan complete! View detailed reports at https://cypherray.com/results', delay: 10400, icon: 'check' },
  ];

  const commands = {
    'help': () => `
Available Commands:
──────────────────────────────────────────────────────
  npm install @cypherray/sdk
    Install the CypherRay SDK package

  npm run scan
    Scan firmware binaries in your project

  clear
    Clear terminal screen

  help
    Display this help message
──────────────────────────────────────────────────────
`,
    'npm install @cypherray/sdk': async () => {
      setIsExecuting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsExecuting(false);
      return npmInstallOutput;
    },
    'npm run scan': async () => {
      setIsExecuting(true);
      
      // Start with empty scan output
      let accumulatedOutput = '';
      
      // Animate scan output line by line
      for (let i = 0; i < scanOutput.length; i++) {
        const line = scanOutput[i];
        const prevLine = i > 0 ? scanOutput[i - 1] : null;
        const waitTime = prevLine ? line.delay - prevLine.delay : line.delay;
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        accumulatedOutput += (accumulatedOutput ? '\n' : '') + line.text;
        
        setHistory(prev => {
          const newHistory = [...prev];
          const scanEntryIndex = newHistory.findIndex(entry => entry.type === 'scanning');
          
          if (scanEntryIndex !== -1) {
            newHistory[scanEntryIndex] = {
              command: '',
              output: accumulatedOutput,
              type: 'scanning',
            };
          } else {
            newHistory.push({
              command: '',
              output: accumulatedOutput,
              type: 'scanning',
            });
          }
          
          return newHistory;
        });
      }
      
      setIsExecuting(false);
      return '';
    },
    'clear': () => {
      setHistory([]);
      return '';
    },
  };

  const handleCommand = async () => {
    const cmd = currentCommand.trim();
    const commandFn = commands[cmd];
    
    if (cmd !== 'clear') {
      setHistory(prev => [...prev, { command: cmd, output: '', type: 'command' }]);
    }
    
    if (commandFn) {
      const output = await commandFn();
      if (output && cmd !== 'npm run scan') {
        setHistory(prev => [...prev, { command: '', output, type: 'output' }]);
      }
    } else if (cmd) {
      const output = `Command not found: ${cmd}\nType 'help' to see available commands.`;
      setHistory(prev => [...prev, { command: '', output, type: 'error' }]);
    }
    
    setCurrentCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isExecuting) {
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandHistory = history.filter(h => h.type === 'command' && h.command);
      setHistoryIndex(prev => {
        const newIndex = Math.min(prev + 1, commandHistory.length - 1);
        if (commandHistory.length > 0) {
          setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]?.command || '');
        }
        return newIndex;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commandHistory = history.filter(h => h.type === 'command' && h.command);
      setHistoryIndex(prev => {
        const newIndex = Math.max(prev - 1, -1);
        setCurrentCommand(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex]?.command || '');
        return newIndex;
      });
    }
  };

  useEffect(() => {
    // Only scroll within the terminal container, not the entire page
    if (bottomRef.current && terminalRef.current) {
      // Use scrollTop instead of scrollIntoView to prevent page scroll
      const terminalContainer = terminalRef.current;
      const scrollContainer = terminalContainer.querySelector('.terminal-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [history.length]);

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    
    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }
    
    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const getTextColor = (entry) => {
    if (entry.type === 'scanning') return 'text-green-400';
    if (entry.type === 'error') return 'text-red-400';
    return 'text-neutral-300';
  };

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="w-full max-w-7xl bg-neutral-950 rounded-xl overflow-hidden shadow-2xl border border-purple-800/30">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 p-3 bg-neutral-900 border-b border-purple-800/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center font-mono text-sm text-neutral-400">
            mac@macs-MacBook-Pro cypherray-test
          </div>
          <div className="text-xs font-mono">
            <span className="text-green-400">●</span> <span className="text-neutral-500">ONLINE</span>
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={terminalRef} 
          className="h-[70vh] overflow-y-auto p-4 space-y-2 bg-neutral-950 cursor-text font-mono text-sm terminal-scroll-container"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#7808d0 #1f2937'
          }}
        >
          <AnimatePresence>
            {history.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                {entry.command && (
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-semibold select-none">mac@cypherray-test %</span>
                    <span className="text-white select-text">{entry.command}</span>
                  </div>
                )}
                {entry.output && (
                  <div className={`whitespace-pre-wrap leading-relaxed select-text ${getTextColor(entry)}`}>
                    {entry.output}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current Command Input */}
          {!isExecuting && (
            <div className="flex gap-2 items-center">
              <span className="text-purple-400 font-semibold">mac@cypherray-test %</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={e => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white caret-purple-400"
                autoFocus
                spellCheck="false"
              />
              <span className="text-purple-400 animate-pulse">█</span>
            </div>
          )}

          {isExecuting && (
            <div className="flex gap-2 items-center">
              <span className="text-purple-400">[...]</span>
              <span className="text-neutral-500">Processing...</span>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>
        
        {/* Terminal Footer */}
        <div className="bg-neutral-900 px-4 py-2 text-xs text-neutral-500 border-t border-purple-800/30 font-mono">
          <div className="flex justify-between items-center">
            <span>Type 'help' for commands • Use ↑/↓ for history</span>
            <span>CypherRay SDK Interactive Terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKTerminal;
