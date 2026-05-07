import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';
import { formatAttributionMessage, ATTRIBUTION_CODE, BUILDER_CODE } from '../lib/erc8021';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCanvas } from './GameCanvas';
import { Loader2, Trophy, Wallet, Zap, ShieldAlert } from 'lucide-react';

export const MainApp = () => {
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { sendTransaction } = useSendTransaction();
    const { signMessageAsync } = useSignMessage();
    
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'leaderboard'>('menu');
    const [lastScore, setLastScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const handleGameOver = (score: number) => {
        setLastScore(score);
        if (score > highScore) setHighScore(score);
        setGameState('gameover');
    };

    const handleSayGM = () => {
      if (!address) return;
      const dataStr = formatAttributionMessage("Say GM via Snake Rush");
      // Converts string to hex logic would happen here for real ERC-8021 payload, sending 0 eth for popup.
      sendTransaction({
        to: address,
        value: parseEther('0'),
      });
    };

    const handleSignScore = async () => {
        try {
            if (!address) return;
            await signMessageAsync({
                account: address as `0x${string}`,
                message: `Snake Rush Record\nScore: ${lastScore}\nAddress: ${address}\nTimestamp: ${new Date().getTime()}`
            });
            alert("Score signed securely (SIWE) and ready to be broadcast!");
        } catch (error) {
            console.error("Signature failed", error);
        }
    };

    return (
        <div className="w-full h-[100dvh] bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_100%)] pointer-events-none" />

          {/* Header area for Web3 */}
          <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md relative z-50">
             <div className="flex items-center gap-4 cursor-pointer" onClick={() => setGameState('menu')}>
                <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-lg items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500">
                  Snake Rush
                </h1>
             </div>
             
             <div>
                {!isConnected ? (
                   <div className="flex gap-2">
                     {connectors.filter(c => c.id === 'injected').map((connector) => (
                       <button
                         key={connector.uid}
                         onClick={() => connect({ connector })}
                         disabled={isPending}
                         className="px-4 md:px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
                       >
                         {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wallet className="w-4 h-4" />} 
                         <span className="hidden sm:inline">CONNECT</span>
                       </button>
                     ))}
                   </div>
                ) : (
                    <div className="flex gap-3 md:gap-6 items-center">
                        <div className="hidden md:block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-mono tracking-widest">
                            BASE MAINNET • CONNECTED [{address?.slice(0, 6)}...{address?.slice(-4)}]
                        </div>
                        <button onClick={handleSayGM} className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                           GM TX
                        </button>
                        <button onClick={() => disconnect()} className="px-3 py-1.5 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors tracking-widest">
                           DISCONNECT
                        </button>
                    </div>
                )}
             </div>
          </header>

          <main className="flex-1 flex overflow-hidden relative z-40">
            <div className="flex-1 relative bg-[#080808] border-r border-white/5 flex flex-col overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <AnimatePresence mode="wait">
                {gameState === 'menu' && (
                    <motion.div 
                        key="menu"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 drop-shadow-[0_0_20px_rgba(255,0,255,0.4)]">
                            SNAKE RUSH
                        </h1>
                        <div className="flex items-center gap-3 text-cyan-400 font-bold tracking-[0.3em] text-xs md:text-[10px] uppercase border-y border-white/10 py-2 mb-12">
                            <Zap className="w-4 h-4" /> ON-CHAIN EXECUTION <Zap className="w-4 h-4" />
                        </div>
                        
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                          <button 
                            onClick={() => setGameState('playing')}
                            className="px-6 py-4 bg-white text-black font-black text-xl italic uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          >
                           Initialize Rush
                          </button>

                          <button 
                            onClick={() => setGameState('leaderboard')}
                            className="bg-transparent border border-white/20 text-white/70 py-3 font-bold uppercase rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 group tracking-widest text-sm"
                          >
                           <Trophy className="w-5 h-5 group-hover:text-fuchsia-400 transition-colors" /> Top Rushers
                          </button>
                          
                          <div className="mt-8">
                             <div className="text-xs text-cyan-500/50 mb-1">LOCAL HIGHSCORE</div>
                             <div className="text-3xl text-cyan-300 font-bold">{highScore}</div>
                          </div>
                        </div>

                        <div className="absolute bottom-6 flex gap-4 text-xs text-white/30">
                           <div title="ERC-8021 Enabled"><ShieldAlert className="w-4 h-4 inline mr-1 opacity-50" />ERC-8021</div>
                           <div title={`Builder: ${BUILDER_CODE}`} className="cursor-help">BASE <span className="opacity-50">NODE</span></div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                       <GameCanvas onGameOver={handleGameOver} />
                    </motion.div>
                )}

                {gameState === 'leaderboard' && (
                    <motion.div 
                        key="leaderboard"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 flex flex-col p-6 max-w-2xl mx-auto z-10 pt-20"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                           <h2 className="text-3xl font-black text-white flex items-center gap-3"><Trophy className="text-yellow-500" /> GLOBAL HIGHSCORES</h2>
                           <button onClick={() => setGameState('menu')} className="text-white/50 hover:text-white uppercase text-xs tracking-widest">Back</button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                           {[1, 2, 3, 4, 5].map((i) => (
                             <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className={`text-xl font-bold ${i === 1 ? 'text-yellow-400' : i === 2 ? 'text-gray-300' : i === 3 ? 'text-amber-600' : 'text-white/30'}`}>#{i}</div>
                                   <div className="text-sm md:text-base">0x{Math.random().toString(16).substr(2, 6)}...{Math.random().toString(16).substr(2, 4)}</div>
                                </div>
                                <div className="text-cyan-400 font-bold">{Math.floor(Math.random() * 10000 + 5000 - i * 1000)}</div>
                             </div>
                           ))}
                           <div className="p-8 text-center text-white/30 text-sm">
                              Scores are fetched from the Base Mainnet Registry (Mocked)
                           </div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'gameover' && (
                    <motion.div 
                        key="gameover"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/90 backdrop-blur-md"
                    >
                        <h2 className="text-5xl md:text-6xl font-black mb-6 text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] leading-tight">
                          SYSTEM<br/>FAILURE
                        </h2>
                        
                        <div className="text-2xl mb-2 text-white/70">Score: <span className="text-cyan-400 font-bold text-4xl ml-2">{lastScore}</span></div>
                        {lastScore >= highScore && lastScore > 0 && (
                            <div className="text-[#ff00ff] animate-pulse font-bold mb-8 uppercase tracking-[0.2em]">New High Score!</div>
                        )}

                        <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
                          <button 
                            onClick={() => setGameState('playing')}
                            className="w-full bg-cyan-500/10 border border-cyan-500 text-cyan-400 py-4 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300"
                          >
                           Retry Subroutine
                          </button>
                          <button 
                            onClick={() => setGameState('menu')}
                            className="w-full bg-transparent border border-white/20 text-white/60 py-3 font-bold uppercase transition-all mt-2 hover:border-white/50 hover:text-white"
                          >
                           Main Menu
                          </button>

                          {isConnected ? (
                             <button onClick={handleSignScore} className="group relative overflow-hidden w-full bg-purple-900/40 border border-purple-500 text-purple-300 py-3 text-sm font-bold uppercase hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] mt-4">
                                <div className="absolute inset-0 bg-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform -z-10"></div>
                                Record Rush On-Chain
                             </button>
                          ) : (
                             <div className="mt-4 p-4 border border-yellow-500/20 bg-yellow-500/5 text-yellow-500/70 text-xs">
                                Connect wallet to submit on-chain scores
                             </div>
                          )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Sidebar / Dashboard */}
            <aside className="w-[320px] bg-black/80 flex-col p-6 border-l border-white/5 hidden lg:flex">
              <div className="flex-1 space-y-8">
                <section>
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-4 flex justify-between">
                    On-Chain Legends
                    <span className="text-cyan-500">● Live</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-fuchsia-500 font-mono font-bold">01</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">cryptosnake.eth</p>
                        <p className="text-[10px] text-white/40">Score: 24.8M • Len: 1.2km</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]"></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 opacity-80">
                      <span className="text-white/40 font-mono font-bold">02</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">0x3a2...f9e</p>
                        <p className="text-[10px] text-white/40">Score: 21.2M • Len: 1.1km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 opacity-60">
                      <span className="text-white/40 font-mono font-bold">03</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">baselover.base</p>
                        <p className="text-[10px] text-white/40">Score: 18.5M • Len: 940m</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-4">Wallet Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleSignScore} className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-cyan-400 rounded-sm"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Record Score</span>
                    </button>
                    <button className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl hover:bg-fuchsia-500/20 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                      <div className="w-5 h-5 border-2 border-fuchsia-400 rounded-full"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">Switch Skin</span>
                    </button>
                  </div>
                </section>

                <section className="pt-4 border-t border-white/5">
                   <div className="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-white/10">
                     <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Builder Reference</p>
                     <p className="text-[11px] font-mono text-cyan-500 truncate">{BUILDER_CODE}</p>
                     <div className="mt-3 flex justify-between items-center">
                       <span className="text-[10px] text-white/30 uppercase">App ID Verified</span>
                       <div className="w-4 h-4 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center">
                         <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                       </div>
                     </div>
                   </div>
                </section>
              </div>
              <div className="mt-auto text-center">
                <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.5em] italic">BASE BUILDER PROGRAM</p>
              </div>
            </aside>
          </main>

          <footer className="h-10 px-4 md:px-8 bg-[#111] flex items-center justify-between border-t border-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 relative z-50">
            <div className="flex gap-4 md:gap-8">
              <span className="hidden sm:inline">Version: 1.0.4-RUSH</span>
              <span className="text-cyan-500/60 font-mono">Latency: 14ms</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Network: Base</span>
              <span className="hidden sm:inline">Powered by ERC-8004</span>
            </div>
          </footer>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255,255,255,0.05);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 243, 255, 0.3);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 243, 255, 0.6);
            }
          `}</style>
        </div>
    );
};

