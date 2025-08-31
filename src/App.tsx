import { useState, useEffect } from "react";
import Web3Provider from "./providers/Web3Provider";
import EnhancedCarRaceGame from "./components/EnhancedCarRaceGame";
import TournamentLobby from "./components/TournamentLobby";
import Leaderboard from "./components/Leaderboard";
import ConnectButton from "./components/ConnectButton";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRacingContract } from "./hooks/useRacingContract";

type GameView = "menu" | "racing" | "tournament" | "leaderboard";

function GameWrapper() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const {
    selectedCar,
    playerCars,
    loading: carLoading,
    mintStarterCar,
    isPending,
    refetchCars,
  } = useRacingContract();
  const [currentView, setCurrentView] = useState<GameView>("menu");
  const [activeTournamentId, setActiveTournamentId] = useState<number | null>(
    null
  );
  const [completedTournaments, setCompletedTournaments] = useState<Set<number>>(
    new Set()
  );
  const [mintingStatus, setMintingStatus] = useState<
    "idle" | "wallet_confirm" | "confirming" | "success" | "error" | "rejected"
  >("idle");
  const [mintingMessage, setMintingMessage] = useState<string>("");
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [hasSuccessfullyMinted, setHasSuccessfullyMinted] =
    useState<boolean>(false);

  const { isSuccess: isConfirmed, isError: isConfirmError } =
    useWaitForTransactionReceipt({
      hash: currentTxHash as `0x${string}`,
      query: { enabled: !!currentTxHash },
    });

  useEffect(() => {
    if (isConfirmed && mintingStatus === "confirming") {
      setMintingStatus("success");
      setHasSuccessfullyMinted(true);
      setMintingMessage(
        " Congratulations! You have successfully purchased your first NFT bike!"
      );

      refetchCars();

      setTimeout(() => {
        setMintingMessage("🎮 Entering the game...");

        refetchCars();
      }, 2000);

      setTimeout(() => {
        setCurrentView("menu");
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);

        setTimeout(() => {
          if (playerCars.length === 0) {
            setHasSuccessfullyMinted(false);
          }
        }, 3000);
      }, 3500);
    } else if (isConfirmError && mintingStatus === "confirming") {
      setMintingStatus("error");
      setMintingMessage(" Transaction failed on blockchain. Please try again.");

      setTimeout(() => {
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);
        setHasSuccessfullyMinted(false);
      }, 2000);
    }
  }, [isConfirmed, isConfirmError, mintingStatus]);

  const handleStartRace = (tournamentId?: number) => {
    setActiveTournamentId(tournamentId || null);
    setCurrentView("racing");
  };

  const handleTournamentCompleted = (tournamentId: number) => {
    console.log(
      `🏆 Tournament ${tournamentId} completed! Marking as completed.`
    );
    setCompletedTournaments((prev) => new Set([...prev, tournamentId]));
  };

  const handleNavigateToTournaments = () => {
    setActiveTournamentId(null);
    setCurrentView("tournament");
  };

  const handleNavigateToMenu = () => {
    setActiveTournamentId(null);
    setCurrentView("menu");
  };

  const handleMintStarterCar = async () => {
    try {
      setMintingStatus("wallet_confirm");
      setMintingMessage("💳 Please confirm the transaction in your wallet...");

      const txHash = await mintStarterCar();

      setCurrentTxHash(txHash);
      setMintingStatus("confirming");
      setMintingMessage("⏳ Waiting for blockchain confirmation...");
    } catch (error: any) {
      console.error("Minting error:", error);

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("user rejected") ||
        error.code === 4001
      ) {
        setMintingStatus("rejected");
        setMintingMessage(
          "❌ Transaction rejected by user. Please try again when ready."
        );
      } else if (error.message?.includes("insufficient")) {
        setMintingStatus("error");
        setMintingMessage(
          "❌ Insufficient funds. You need at least 0.01 VERY to mint a Starter Vehicle."
        );
      } else if (error.message?.includes("Already has starter vehicle")) {
        setMintingStatus("error");
        setMintingMessage(
          "❌ You already have a starter vehicle. Please refresh the page."
        );
      } else {
        setMintingStatus("error");
        setMintingMessage(
          "❌ Minting failed. Please check your wallet and try again."
        );
      }

      setTimeout(() => {
        setMintingStatus("idle");
        setMintingMessage("");
        setCurrentTxHash(null);
        setHasSuccessfullyMinted(false);
      }, 2000);
    }
  };

  if (!isConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)",
          position: "relative",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        {/* Header */}
        <nav
          style={{
            position: "absolute",
            top: "0",
            width: "100%",
            padding: "25px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 50,
            background: "rgba(15, 15, 15, 0.3)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
              }}
            >
              🏎️
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0",
                background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              VERY RACING
            </h1>
          </div>
          <ConnectButton />
        </nav>

        {/* Main Content */}
        <div
          style={{
            padding: "120px 20px 120px",
            minHeight: "150vh",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "80px",
              alignItems: "center",
            }}
          >
            {/* Main Content */}
            <div style={{ color: "white", textAlign: "center", maxWidth: "900px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#ffd700",
                  marginBottom: "16px",
                }}
              >
                Next-Generation Gaming
              </div>
              
              <h1
                style={{
                  fontSize: "clamp(36px, 8vw, 56px)",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "24px",
                  background: "linear-gradient(135deg, #ffffff 0%, #ffd700 50%, #ff6b6b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Race. Earn. <span style={{ color: "#00ff88" }}>Dominate.</span>
              </h1>

              <p
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  lineHeight: "1.6",
                  marginBottom: "40px",
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth: "600px",
                  margin: "0 auto 40px",
                }}
              >
                Experience the ultimate blockchain racing game where every vehicle is an NFT, 
                every race counts, and every victory earns you real rewards.
              </p>

              {/* Feature Pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "48px",
                }}
              >
                {[
                  { icon: "⚡", text: "Instant Transactions", color: "#ffd700" },
                  { icon: "🏆", text: "Real Rewards", color: "#00ff88" },
                  { icon: "🔥", text: "NFT Vehicles", color: "#ff6b6b" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "25px",
                      border: `1px solid ${feature.color}33`,
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{feature.icon}</span>
                    {feature.text}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "48px",
                }}
              >
                <button
                  onClick={() => open()}
                  style={{
                    padding: "16px 32px",
                    background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 32px rgba(255, 215, 0, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(255, 215, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 215, 0, 0.3)";
                  }}
                >
                  Connect Wallet to Start
                </button>
                
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Free to connect • Low gas fees
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "32px",
                  width: "100%",
                  maxWidth: "600px",
                }}
              >
                {[
                  { value: "1M+", label: "FAST Tokens", color: "#ffd700" },
                  { value: "10K+", label: "Races Completed", color: "#00ff88" },
                  { value: "500+", label: "Active Players", color: "#ff6b6b" },
                ].map((stat, index) => (
                  <div key={index}>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: stat.color,
                        lineHeight: "1",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginTop: "4px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
                width: "100%",
                maxWidth: "1000px",
              }}
            >
              {[
                {
                  icon: "🏎️",
                  title: "Premium NFT Vehicles",
                  description: "Collect unique vehicles with distinct stats, rarities, and visual styles. Each NFT is your key to the racing universe.",
                  color: "#ffd700",
                },
                {
                  icon: "⚡",
                  title: "Lightning-Fast Gameplay",
                  description: "Built on Very Network for instant transactions and seamless gaming. No waiting, just pure racing action.",
                  color: "#00ff88",
                },
                {
                  icon: "🏆",
                  title: "Competitive Tournaments",
                  description: "Join global tournaments, climb leaderboards, and earn substantial FAST token rewards for your victories.",
                  color: "#ff6b6b",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    padding: "32px",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(${feature.color === "#ffd700" ? "255,215,0" : feature.color === "#00ff88" ? "0,255,136" : "255,107,107"},0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "20px",
                      filter: `drop-shadow(0 0 20px ${feature.color}80)`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: feature.color,
                      marginBottom: "12px",
                      lineHeight: "1.2",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      color: "rgba(255,255,255,0.7)",
                      margin: "0",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Footer Content for Scroll */}
            <div
              style={{
                marginTop: "120px",
                padding: "60px 20px",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.6)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "800px",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  color: "#ffd700",
                }}
              >
                Ready to Start Racing?
              </h3>
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                }}
              >
                Join thousands of players in the ultimate blockchain racing experience. 
                Mint your NFT vehicles, compete in tournaments, and earn real rewards.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "40px",
                  marginTop: "40px",
                }}
              >
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>🏁</div>
                  <h4 style={{ color: "#ffd700", marginBottom: "8px" }}>Race to Win</h4>
                  <p style={{ fontSize: "14px" }}>Compete against players worldwide</p>
                </div>
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>💰</div>
                  <h4 style={{ color: "#00ff88", marginBottom: "8px" }}>Earn Rewards</h4>
                  <p style={{ fontSize: "14px" }}>Win FAST tokens and prizes</p>
                </div>
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>🚀</div>
                  <h4 style={{ color: "#ff6b6b", marginBottom: "8px" }}>Level Up</h4>
                  <p style={{ fontSize: "14px" }}>Upgrade your vehicles and skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔍 App state:", {
    isConnected,
    carLoading,
    playerCarsLength: playerCars.length,
    hasSuccessfullyMinted,
    mintingStatus,
    currentView,
  });

  if (
    isConnected &&
    !carLoading &&
    playerCars.length === 0 &&
    !hasSuccessfullyMinted
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)",
          position: "relative",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: "150px",
            height: "150px",
            background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite reverse",
          }}
        />

        {/* Header */}
        <nav
          style={{
            position: "absolute",
            top: "0",
            width: "100%",
            padding: "25px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 50,
            background: "rgba(15, 15, 15, 0.3)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
              }}
            >
              🏍️
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                margin: "0",
                background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              VERY RACING
            </h1>
          </div>
          <ConnectButton />
        </nav>

        {/* Main Content */}
        <div
          style={{
            padding: "120px 20px 120px",
            minHeight: "150vh",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              width: "100%",
              margin: "0 auto",
              textAlign: "center",
              color: "white",
            }}
          >
            {/* Welcome Header */}
            <div
              style={{
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#ffd700",
                  marginBottom: "16px",
                }}
              >
                🎯 Ready to Race
              </div>
              
              <h1
                style={{
                  fontSize: "clamp(32px, 6vw, 48px)",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "20px",
                  background: "linear-gradient(135deg, #ffffff 0%, #ffd700 50%, #00ff88 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Welcome to the Track!
              </h1>

              <p
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  lineHeight: "1.5",
                  color: "rgba(255, 255, 255, 0.8)",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                You're just one step away from entering the ultimate racing experience. 
                Mint your first NFT vehicle to unlock the world of competitive blockchain racing.
              </p>
            </div>

            {/* Mint Card */}
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "clamp(24px, 5vw, 48px)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(30px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
              }}
            >
              {/* Vehicle Icon */}
              <div
                style={{
                  fontSize: "80px",
                  marginBottom: "32px",
                  filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                🏍️
              </div>

              <h2
                style={{
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: "700",
                  marginBottom: "16px",
                  background: "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Mint Your Starter Bike
              </h2>

              <p
                style={{
                  fontSize: "clamp(16px, 3vw, 18px)",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "32px",
                  maxWidth: "400px",
                  margin: "0 auto 24px",
                }}
              >
                Get your first NFT racing bike and start your journey to becoming the ultimate Very Racing champion.
              </p>

              {/* Features Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  { icon: "⚡", title: "Fast & Agile", desc: "Perfect for beginners" },
                  { icon: "🎯", title: "Balanced Stats", desc: "Great all-around performance" },
                  { icon: "💎", title: "NFT Ownership", desc: "Truly yours forever" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "16px 12px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                      {feature.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#ffd700",
                        marginBottom: "4px",
                      }}
                    >
                      {feature.title}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: "1.3",
                      }}
                    >
                      {feature.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,107,107,0.1) 100%)",
                  borderRadius: "50px",
                  border: "1px solid rgba(255,215,0,0.3)",
                  marginBottom: "32px",
                }}
              >
                <span style={{ fontSize: "20px" }}>💰</span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#ffd700",
                  }}
                >
                  Only 0.01 VERY
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  (~$0.50)
                </span>
              </div>

              {/* Status Messages */}
              {mintingMessage && (
                <div
                  style={{
                    marginBottom: "32px",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    background:
                      mintingStatus === "success"
                        ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)"
                        : mintingStatus === "error" || mintingStatus === "rejected"
                        ? "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)"
                        : "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)",
                    border: `1px solid ${
                      mintingStatus === "success"
                        ? "rgba(16,185,129,0.3)"
                        : mintingStatus === "error" || mintingStatus === "rejected"
                        ? "rgba(239,68,68,0.3)"
                        : "rgba(59,130,246,0.3)"
                    }`,
                  }}
                >
                  {(mintingStatus === "wallet_confirm" || mintingStatus === "confirming") && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid transparent",
                        borderTop: "2px solid currentColor",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color:
                        mintingStatus === "success"
                          ? "#10b981"
                          : mintingStatus === "error" || mintingStatus === "rejected"
                          ? "#ef4444"
                          : "#3b82f6",
                    }}
                  >
                    {mintingMessage}
                  </span>
                </div>
              )}

              {/* Mint Button */}
              <button
                onClick={handleMintStarterCar}
                disabled={
                  mintingStatus === "wallet_confirm" ||
                  mintingStatus === "confirming" ||
                  mintingStatus === "success" ||
                  isPending
                }
                style={{
                  padding: "clamp(16px, 3vw, 20px) clamp(24px, 6vw, 48px)",
                  background:
                    mintingStatus === "success"
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : mintingStatus === "wallet_confirm" ||
                        mintingStatus === "confirming" ||
                        isPending
                      ? "#6b7280"
                      : "linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)",
                  color: mintingStatus === "success" ? "white" : "#000",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: "clamp(16px, 3vw, 18px)",
                  fontWeight: "700",
                  cursor:
                    mintingStatus === "wallet_confirm" ||
                    mintingStatus === "confirming" ||
                    mintingStatus === "success" ||
                    isPending
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(255,215,0,0.3)",
                  opacity:
                    mintingStatus === "wallet_confirm" ||
                    mintingStatus === "confirming" ||
                    isPending
                      ? 0.6
                      : 1,
                  width: "100%",
                  maxWidth: "320px",
                }}
                onMouseEnter={(e) => {
                  if (
                    mintingStatus !== "wallet_confirm" &&
                    mintingStatus !== "confirming" &&
                    mintingStatus !== "success" &&
                    !isPending
                  ) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,215,0,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    mintingStatus !== "wallet_confirm" &&
                    mintingStatus !== "confirming" &&
                    mintingStatus !== "success" &&
                    !isPending
                  ) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,215,0,0.3)";
                  }
                }}
              >
                {mintingStatus === "wallet_confirm" ? (
                  <>💳 Confirm in Wallet...</>
                ) : mintingStatus === "confirming" ? (
                  <>⏳ Minting on Blockchain...</>
                ) : mintingStatus === "success" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid transparent",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    🎮 Entering Game...
                  </div>
                ) : (
                  <>🏍️ Mint Starter Bike • 0.01 VERY</>
                )}
              </button>

              {/* Security Note */}
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "24px",
                  lineHeight: "1.4",
                }}
              >
                🔒 Secure transaction powered by Very Network<br />
                Your NFT will be instantly available in your wallet
              </p>
            </div>

            {/* Additional Information Section */}
            <div
              style={{
                marginTop: "80px",
                padding: "40px 20px",
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "600px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#ffd700",
                }}
              >
                What happens after minting?
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "32px",
                  marginTop: "32px",
                }}
              >
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏍️</div>
                  <h4 style={{ color: "#00ff88", marginBottom: "4px", fontSize: "14px" }}>Your Bike</h4>
                  <p style={{ fontSize: "12px" }}>Instantly available in your garage</p>
                </div>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏁</div>
                  <h4 style={{ color: "#ffd700", marginBottom: "4px", fontSize: "14px" }}>Start Racing</h4>
                  <p style={{ fontSize: "12px" }}>Jump into races immediately</p>
                </div>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>💰</div>
                  <h4 style={{ color: "#ff6b6b", marginBottom: "4px", fontSize: "14px" }}>Earn Rewards</h4>
                  <p style={{ fontSize: "12px" }}>Win FAST tokens from races</p>
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "32px",
                  opacity: 0.8,
                }}
              >
                Your starter bike comes with balanced stats perfect for beginners. 
                Race, earn tokens, and upgrade to unlock premium vehicles!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {currentView !== "racing" && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.3)",
              padding: "8px 12px",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => {
                setCurrentView("menu");
                setActiveTournamentId(null);
              }}
              style={{
                background:
                  currentView === "menu"
                    ? "linear-gradient(45deg, #ff6b6b, #ffd700)"
                    : "transparent",
                color: currentView === "menu" ? "#000" : "#fff",
                border:
                  currentView === "menu"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "menu"
                    ? "0 4px 15px rgba(255,107,107,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "menu") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "menu") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              🏎️ Race
            </button>

            <button
              onClick={() => setCurrentView("tournament")}
              style={{
                background:
                  currentView === "tournament"
                    ? "linear-gradient(45deg, #8b5cf6, #06b6d4)"
                    : "transparent",
                color: currentView === "tournament" ? "#000" : "#fff",
                border:
                  currentView === "tournament"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "tournament"
                    ? "0 4px 15px rgba(139,92,246,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "tournament") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "tournament") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              🏆 Tournaments
            </button>

            <button
              onClick={() => setCurrentView("leaderboard")}
              style={{
                background:
                  currentView === "leaderboard"
                    ? "linear-gradient(45deg, #10b981, #ffd700)"
                    : "transparent",
                color: currentView === "leaderboard" ? "#000" : "#fff",
                border:
                  currentView === "leaderboard"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.2)",
                padding: "8px 12px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  currentView === "leaderboard"
                    ? "0 4px 15px rgba(16,185,129,0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (currentView !== "leaderboard") {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== "leaderboard") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0px)";
                }
              }}
            >
              📊 Leaderboard
            </button>
          </div>

          <ConnectButton />
        </div>
      )}

      {currentView === "menu" && (
        <EnhancedCarRaceGame
          onNavigateToTournaments={handleNavigateToTournaments}
          onNavigateToMenu={handleNavigateToMenu}
        />
      )}

      {currentView === "racing" && (
        <EnhancedCarRaceGame
          activeTournamentId={activeTournamentId}
          onTournamentCompleted={handleTournamentCompleted}
          onNavigateToTournaments={handleNavigateToTournaments}
          onNavigateToMenu={handleNavigateToMenu}
        />
      )}

      {currentView === "tournament" && (
        <TournamentLobby
          onStartRace={handleStartRace}
          onClose={() => setCurrentView("menu")}
          selectedCarId={selectedCar?.id}
          completedTournamentsFromApp={completedTournaments}
        />
      )}

      {currentView === "leaderboard" && (
        <Leaderboard onClose={() => setCurrentView("menu")} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}
        </style>
        <GameWrapper />
      </Web3Provider>
    </ErrorBoundary>
  );
}

export default App;
