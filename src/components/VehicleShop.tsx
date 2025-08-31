import React, { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { RACING_CONTRACT_ADDRESS, RACING_ABI } from "../hooks/useRacingContract";

interface CarNFT {
  id: number;
  speed: number;
  handling: number;
  acceleration: number;
  rarity: number;
  experience: number;
  wins: number;
  races: number;
  name: string;
  color?: string;
  isStaked?: boolean;
}

interface VehicleShopProps {
  // Vehicle data
  playerCars: CarNFT[];
  selectedCar: CarNFT | null;
  purchasingCar: string;
  
  // State setters
  setPurchasingCar: (car: string) => void;
  setPurchaseConfirmation: (message: string) => void;
  setSelectedCar: (car: CarNFT) => void;
  
  // Utility functions
  showPopup: (message: string) => void;
  refetchCars: () => void;
  
  // UI state
  isMobile: boolean;
  carSelectionMode: "select" | "mint" | "breed";
  
  // Breeding state
  selectedParent1: number | null;
  selectedParent2: number | null;
  setSelectedParent1: (id: number | null) => void;
  setSelectedParent2: (id: number | null) => void;
  setBreedingNotification: (message: string) => void;
  
  // Handlers
  onCarSelect?: (car: CarNFT) => void;
  onClose?: () => void;
}

export const VehicleShop: React.FC<VehicleShopProps> = ({
  playerCars,
  selectedCar,
  purchasingCar,
  setPurchasingCar,
  setPurchaseConfirmation,
  setSelectedCar,
  showPopup,
  refetchCars,
  isMobile,
  carSelectionMode,
  selectedParent1,
  selectedParent2,
  setSelectedParent1,
  setSelectedParent2,
  setBreedingNotification,
  onCarSelect,
  onClose,
}) => {
  const { writeContractAsync } = useWriteContract();
  const [breedingInProgress, setBreedingInProgress] = useState(false);

  // Check if player has a specific vehicle type
  const hasCarType = useCallback((carType: "bike" | "car" | "truck" | "hybrid") => {
    if (!playerCars || playerCars.length === 0) {
      return false;
    }

    return playerCars.some((car) => {
      if (carType === "bike") {
        return car.name === "Bike" || car.id === 1;
      } else if (carType === "car") {
        return car.name === "Car";
      } else if (carType === "truck") {
        return car.name === "Truck";
      } else if (carType === "hybrid") {
        return car.name && car.name.includes("Hybrid");
      }
      return false;
    });
  }, [playerCars]);

  // Get car color based on stats
  const getCarColor = useCallback((car: CarNFT): string => {
    if (car.color) return car.color;
    
    const totalStats = car.speed + car.handling + car.acceleration;
    if (totalStats > 240) return "#ffd700"; // Gold for high-end cars
    if (totalStats > 200) return "#ff4444"; // Red for sport cars  
    if (totalStats > 160) return "#4444ff"; // Blue for decent cars
    return "#888888"; // Gray for basic cars
  }, []);

  // Get car characteristics description
  const getCarCharacteristics = useCallback((car: CarNFT): string => {
    const totalStats = car.speed + car.handling + car.acceleration;
    if (totalStats > 240) return "Elite Performance";
    if (totalStats > 200) return "High Performance";
    if (totalStats > 160) return "Balanced Performance";
    return "Standard Performance";
  }, []);

  // Check if two cars can be bred
  const canBreedCars = useCallback((car1Id: number, car2Id: number): boolean => {
    const car1 = playerCars.find(c => c.id === car1Id);
    const car2 = playerCars.find(c => c.id === car2Id);
    
    if (!car1 || !car2 || car1.id === car2.id) return false;
    if (car1.isStaked || car2.isStaked) return false;
    
    // Additional breeding rules can be added here
    return true;
  }, [playerCars]);

  // Vehicle minting functions
  const mintBikeLocal = useCallback(async () => {
    try {
      const txHash = await writeContractAsync({
        address: RACING_CONTRACT_ADDRESS,
        abi: RACING_ABI,
        functionName: "mintBike",
        value: parseEther("0.01"),
      });
      return txHash;
    } catch (error) {
      console.error("❌ Failed to mint bike:", error);
      throw error;
    }
  }, [writeContractAsync]);

  const mintCarLocal = useCallback(async () => {
    try {
      const txHash = await writeContractAsync({
        address: RACING_CONTRACT_ADDRESS,
        abi: RACING_ABI,
        functionName: "mintCar",
        value: parseEther("0.05"),
      });
      return txHash;
    } catch (error) {
      console.error("❌ Failed to mint car:", error);
      throw error;
    }
  }, [writeContractAsync]);

  const mintTruckLocal = useCallback(async () => {
    try {
      const txHash = await writeContractAsync({
        address: RACING_CONTRACT_ADDRESS,
        abi: RACING_ABI,
        functionName: "mintTruck",
        value: parseEther("0.08"),
      });
      return txHash;
    } catch (error) {
      console.error("❌ Failed to mint truck:", error);
      throw error;
    }
  }, [writeContractAsync]);

  const mintPremiumCarLocal = useCallback(async () => {
    try {
      const txHash = await writeContractAsync({
        address: RACING_CONTRACT_ADDRESS,
        abi: RACING_ABI,
        functionName: "mintPremiumCar",
        value: parseEther("0.05"),
      });
      return txHash;
    } catch (error) {
      console.error("❌ Failed to mint premium car:", error);
      throw error;
    }
  }, [writeContractAsync]);

  // Main vehicle purchase function
  const mintCarWithConfirmation = useCallback(async (
    carType: "bike" | "premium",
    carName: string
  ) => {
    if (purchasingCar) return;

    try {
      setPurchasingCar(carName);

      if (carType === "bike") {
        await mintBikeLocal();
      } else if (carName === "Car") {
        await mintCarLocal();
      } else if (carName === "Truck") {
        await mintTruckLocal();
      } else {
        await mintPremiumCarLocal();
      }

      const isFirstTimeMint = playerCars.length === 0;
      const successMessage = isFirstTimeMint
        ? `🎉 Welcome to Very Racing! Your ${carName} has been minted successfully. Redirecting to game...`
        : `🎉 ${carName} successfully purchased! Your new NFT car is ready to race!`;

      setPurchaseConfirmation(successMessage);

      setTimeout(() => {
        refetchCars();
        setPurchasingCar("");
        
        if (isFirstTimeMint) {
          setTimeout(() => {
            setPurchaseConfirmation("");
          }, 3000);
        }
      }, 2000);

    } catch (error) {
      console.error("❌ Minting failed:", error);
      setPurchasingCar("");
      
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds")) {
          showPopup("❌ Insufficient funds. Please add more VERY to your wallet.");
        } else if (error.message.includes("User rejected")) {
          showPopup("❌ Transaction cancelled by user.");
        } else {
          showPopup(`❌ Minting failed: ${error.message}`);
        }
      } else {
        showPopup("❌ An unexpected error occurred during minting.");
      }
    }
  }, [
    purchasingCar,
    setPurchasingCar,
    setPurchaseConfirmation,
    showPopup,
    refetchCars,
    playerCars.length,
    mintBikeLocal,
    mintCarLocal,
    mintTruckLocal,
    mintPremiumCarLocal,
  ]);

  // Breed cars function
  const breedCarsWithConfirmation = useCallback(async () => {
    if (!selectedParent1 || !selectedParent2 || breedingInProgress) return;
    
    if (!canBreedCars(selectedParent1, selectedParent2)) {
      setBreedingNotification("❌ These cars cannot be bred together.");
      return;
    }

    try {
      setBreedingInProgress(true);
      setBreedingNotification("🧬 Breeding in progress...");

      const txHash = await writeContractAsync({
        address: RACING_CONTRACT_ADDRESS,
        abi: RACING_ABI,
        functionName: "breedCars",
        args: [BigInt(selectedParent1), BigInt(selectedParent2)],
        value: parseEther("0.01"),
      });

      setBreedingNotification(
        "🎉 Breeding successful! Your new Gen-X Hybrid will be ready in 24 hours. Check your garage!"
      );

      setTimeout(() => {
        refetchCars();
        setSelectedParent1(null);
        setSelectedParent2(null);
      }, 2000);

    } catch (error) {
      console.error("❌ Breeding failed:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds")) {
          setBreedingNotification("❌ Insufficient funds for breeding (0.01 XTZ required).");
        } else if (error.message.includes("cooldown")) {
          setBreedingNotification("❌ One of the parent cars is still in breeding cooldown.");
        } else if (error.message.includes("staked")) {
          setBreedingNotification("❌ Cannot breed staked cars. Please unstake them first.");
        } else {
          setBreedingNotification(`❌ Breeding failed: ${error.message}`);
        }
      } else {
        setBreedingNotification("❌ An unexpected error occurred during breeding.");
      }
    } finally {
      setBreedingInProgress(false);
    }
  }, [
    selectedParent1,
    selectedParent2,
    breedingInProgress,
    canBreedCars,
    setBreedingNotification,
    writeContractAsync,
    refetchCars,
    setSelectedParent1,
    setSelectedParent2,
  ]);

  // Handle car selection for breeding
  const handleCarSelectForBreeding = useCallback((car: CarNFT) => {
    if (car.isStaked) {
      showPopup("❌ Cannot select staked cars for breeding.");
      return;
    }

    if (!selectedParent1) {
      setSelectedParent1(car.id);
    } else if (!selectedParent2 && car.id !== selectedParent1) {
      setSelectedParent2(car.id);
    } else if (car.id === selectedParent1) {
      setSelectedParent1(null);
    } else if (car.id === selectedParent2) {
      setSelectedParent2(null);
    } else {
      // Replace first parent if both are selected
      setSelectedParent1(car.id);
      setSelectedParent2(null);
    }
  }, [selectedParent1, selectedParent2, setSelectedParent1, setSelectedParent2, showPopup]);

  // Car selection mode - breeding interface
  if (carSelectionMode === "breed") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          color: "white",
          textAlign: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "24px" : "36px",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          🧬 Car Breeding Lab
        </h1>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            maxWidth: "600px",
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#ffd700" }}>
            💡 Breeding Instructions
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.6", textAlign: "left" }}>
            Select two different cars to breed them together. Breeding costs 0.01 XTZ
            and creates a unique Gen-X Hybrid with combined traits from both parents.
            Cars must not be staked and must be off breeding cooldown.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            maxWidth: "1200px",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          {playerCars.map((car) => (
            <div
              key={car.id}
              onClick={() => handleCarSelectForBreeding(car)}
              style={{
                border: selectedParent1 === car.id 
                  ? "3px solid #10b981"
                  : selectedParent2 === car.id
                  ? "3px solid #f59e0b" 
                  : car.isStaked
                  ? "2px solid #6b7280"
                  : "2px solid #374151",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: car.isStaked ? "#374151" : "#1f2937",
                cursor: car.isStaked ? "not-allowed" : "pointer",
                opacity: car.isStaked ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "20px",
                  backgroundColor: getCarColor(car),
                  borderRadius: "4px",
                  margin: "0 auto 8px",
                }}
              />
              
              <h4 style={{ marginBottom: "8px", color: "white" }}>
                {car.name} #{car.id}
                {car.isStaked && (
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#ef4444",
                      color: "white",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      marginLeft: "4px",
                    }}
                  >
                    STAKED
                  </span>
                )}
              </h4>
              
              <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                <div>Speed: {car.speed}</div>
                <div>Handling: {car.handling}</div>
                <div>Acceleration: {car.acceleration}</div>
              </div>
              
              <div style={{ fontSize: "10px", color: "#9ca3af" }}>
                {getCarCharacteristics(car)}
              </div>

              {selectedParent1 === car.id && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    background: "#10b981",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  PARENT 1
                </div>
              )}
              
              {selectedParent2 === car.id && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    background: "#f59e0b",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  PARENT 2
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedParent1 && selectedParent2 && (
          <button
            onClick={breedCarsWithConfirmation}
            disabled={breedingInProgress || !canBreedCars(selectedParent1, selectedParent2)}
            style={{
              backgroundColor: breedingInProgress ? "#6b7280" : "#8b5cf6",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              cursor: breedingInProgress ? "not-allowed" : "pointer",
              marginBottom: "16px",
            }}
          >
            {breedingInProgress ? "⏳ Breeding..." : "🧬 Breed Selected Cars (0.01 XTZ)"}
          </button>
        )}

        <button
          onClick={onClose}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕ Close
        </button>
      </div>
    );
  }

  // Car selection mode - selection interface
  if (carSelectionMode === "select") {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          color: "white",
          textAlign: "center",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "24px" : "36px",
            marginBottom: "30px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          🔧 Select Your Vehicle
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          {playerCars.map((car) => (
            <div
              key={car.id}
              onClick={() => {
                if (!car.isStaked) {
                  if (onCarSelect) {
                    onCarSelect(car);
                  } else {
                    setSelectedCar(car);
                    if (onClose) onClose();
                  }
                } else {
                  showPopup("❌ Cannot select staked cars for racing.");
                }
              }}
              style={{
                border: selectedCar?.id === car.id 
                  ? "3px solid #10b981"
                  : car.isStaked
                  ? "2px solid #6b7280"
                  : "2px solid #374151",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: car.isStaked ? "#374151" : "#1f2937",
                cursor: car.isStaked ? "not-allowed" : "pointer",
                opacity: car.isStaked ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "30px",
                  backgroundColor: getCarColor(car),
                  borderRadius: "6px",
                  margin: "0 auto 12px",
                }}
              />
              
              <h3 style={{ marginBottom: "12px", color: "white" }}>
                {car.name} #{car.id}
                {car.isStaked && (
                  <span
                    style={{
                      fontSize: "12px",
                      background: "#ef4444",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginLeft: "8px",
                    }}
                  >
                    🔒 STAKED
                  </span>
                )}
              </h3>
              
              <div style={{ fontSize: "14px", marginBottom: "12px" }}>
                <div style={{ marginBottom: "4px" }}>⚡ Speed: {car.speed}</div>
                <div style={{ marginBottom: "4px" }}>🎯 Handling: {car.handling}</div>
                <div style={{ marginBottom: "4px" }}>🚀 Acceleration: {car.acceleration}</div>
                <div>🏁 Wins: {car.wins}</div>
              </div>
              
              <div
                style={{
                  fontSize: "12px",
                  color: "#ffd700",
                  fontWeight: "bold",
                }}
              >
                {getCarCharacteristics(car)}
              </div>

              {selectedCar?.id === car.id && !car.isStaked && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "6px 12px",
                    background: "#10b981",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ✅ SELECTED
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            marginTop: "30px",
          }}
        >
          ✕ Close
        </button>
      </div>
    );
  }

  // First-time purchase screen (when user has no vehicles)
  if (!playerCars || playerCars.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          color: "white",
          textAlign: "center",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        {/* Background Animation Elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)
            `,
            animation: "pulse 4s ease-in-out infinite alternate",
          }}
        />

        {/* Main Content Container */}
        <div 
          style={{ 
            position: "relative",
            zIndex: 2,
            maxWidth: "800px",
            width: "100%",
          }}
        >
          {/* Hero Section */}
          <div 
            style={{
              marginBottom: "60px",
              animation: "fadeInUp 1s ease-out",
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "50px",
                padding: "8px 20px",
                marginBottom: "20px",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              🎮 Web3 Racing Game
            </div>
            
            <h1
              style={{
                fontSize: isMobile ? "42px" : "72px",
                marginBottom: "20px",
                fontWeight: "900",
                background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
              }}
            >
              Very Racing
            </h1>
            
            <p 
              style={{ 
                fontSize: isMobile ? "18px" : "24px", 
                marginBottom: "0px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "300",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.5",
              }}
            >
              Experience the future of blockchain racing. Mint, race, and earn with NFT vehicles.
            </p>
          </div>

          {/* Welcome Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: isMobile ? "40px 30px" : "50px 60px",
              maxWidth: "600px",
              margin: "0 auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              animation: "fadeInUp 1s ease-out 0.3s both",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "50px",
                padding: "12px 24px",
                marginBottom: "30px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#10b981",
              }}
            >
              🏁 Ready to Race
            </div>

            <h2 
              style={{ 
                fontSize: isMobile ? "28px" : "36px",
                marginBottom: "20px",
                fontWeight: "700",
                color: "white",
                lineHeight: "1.2",
              }}
            >
              Start Your Racing Journey
            </h2>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                marginBottom: "40px",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: "400",
              }}
            >
              Get your first NFT vehicle to enter the world of competitive blockchain racing. 
              <br />Choose your <strong style={{ color: "#06b6d4" }}>Bike</strong> and start competing today!
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => mintCarWithConfirmation("bike", "Bike")}
              disabled={purchasingCar !== ""}
              style={{
                background: purchasingCar 
                  ? "rgba(107, 114, 128, 0.5)" 
                  : "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                padding: "18px 40px",
                fontSize: "20px",
                fontWeight: "600",
                cursor: purchasingCar ? "not-allowed" : "pointer",
                marginBottom: "30px",
                opacity: purchasingCar ? 0.6 : 1,
                transition: "all 0.3s ease",
                transform: purchasingCar ? "scale(0.98)" : "scale(1)",
                boxShadow: purchasingCar 
                  ? "none" 
                  : "0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1)",
                display: "block",
                width: "100%",
              }}
              onMouseOver={(e) => {
                if (!purchasingCar) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 15px 35px -5px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.2)";
                }
              }}
              onMouseOut={(e) => {
                if (!purchasingCar) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1)";
                }
              }}
            >
              {purchasingCar === "Bike" ? "⏳ Minting Your Bike..." : "🏍️ Mint Your First Bike • 0.01 VERY"}
            </button>

            {/* Info Section */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "20px", marginRight: "10px" }}>💎</span>
                <h3 
                  style={{ 
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#a78bfa",
                    margin: 0,
                  }}
                >
                  What's Next?
                </h3>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.5",
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0,
                }}
              >
                After minting your Bike, explore the <strong>Vehicle Shop</strong> to upgrade to premium vehicles like <strong>Cars</strong> and <strong>Trucks</strong>. You can even breed vehicles to create the legendary <strong style={{ color: "#ffd700" }}>Gen-X Hybrid</strong>!
              </p>
            </div>
          </div>

          {/* Footer Features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "60px",
              maxWidth: "800px",
              margin: "60px auto 0",
              animation: "fadeInUp 1s ease-out 0.6s both",
            }}
          >
            {[
              { icon: "🏆", title: "Compete & Earn", desc: "Race against others and earn rewards" },
              { icon: "🔧", title: "Customize", desc: "Upgrade and modify your vehicles" },
              { icon: "🌟", title: "Collect NFTs", desc: "Own unique blockchain-based assets" }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{feature.icon}</div>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulse {
              0% { opacity: 0.4; }
              100% { opacity: 0.8; }
            }
          `
        }} />
      </div>
    );
  }

  // Vehicle Shop Screen (mint mode)
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        color: "white",
        textAlign: "center",
        padding: "20px",
        overflow: "auto",
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? "32px" : "48px",
          marginBottom: "40px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        🏪 Vehicle Shop
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "30px",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Bike */}
        <div
          style={{
            border: hasCarType("bike")
              ? "2px solid #6b7280"
              : "2px solid #10b981",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: hasCarType("bike")
              ? "#374151"
              : "#065f46",
            cursor: hasCarType("bike") ? "not-allowed" : "pointer",
            opacity: hasCarType("bike") ? 0.6 : 1,
          }}
          onClick={async () => {
            if (!hasCarType("bike") && !purchasingCar) {
              await mintCarWithConfirmation("bike", "Bike");
            }
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: hasCarType("bike") ? "#9ca3af" : "#10b981",
            }}
          >
            🏍️ Bike
          </h3>
          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            <div>⚡ Speed: 50/100</div>
            <div>🎯 Handling: 60/100</div>
            <div>🚀 Acceleration: 55/100</div>
            <div>
              Rarity: <span style={{ color: "#4ade80" }}>Common</span>
            </div>
          </div>
          <div
            style={{
              background: hasCarType("bike")
                ? "#6b7280"
                : purchasingCar === "Bike"
                ? "#fbbf24"
                : "#10b981",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {hasCarType("bike")
              ? "✅ Purchased"
              : purchasingCar === "Bike"
              ? "⏳ Buying..."
              : "Buy for 0.01 VERY"}
          </div>
        </div>

        {/* Car */}
        <div
          style={{
            border: hasCarType("car")
              ? "2px solid #6b7280"
              : "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: hasCarType("car")
              ? "#374151"
              : "#1e40af",
            cursor: hasCarType("car") ? "not-allowed" : "pointer",
            opacity: hasCarType("car") ? 0.6 : 1,
          }}
          onClick={async () => {
            if (!hasCarType("car") && !purchasingCar) {
              await mintCarWithConfirmation("premium", "Car");
            }
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: hasCarType("car") ? "#9ca3af" : "#3b82f6",
            }}
          >
            🚗 Car
          </h3>
          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            <div>⚡ Speed: 70/100</div>
            <div>🎯 Handling: 65/100</div>
            <div>🚀 Acceleration: 75/100</div>
            <div>
              Rarity: <span style={{ color: "#60a5fa" }}>Uncommon</span>
            </div>
          </div>
          <div
            style={{
              background: hasCarType("car")
                ? "#6b7280"
                : purchasingCar === "Car"
                ? "#fbbf24"
                : "#3b82f6",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {hasCarType("car")
              ? "✅ Purchased"
              : purchasingCar === "Car"
              ? "⏳ Buying..."
              : "Buy for 0.05 VERY"}
          </div>
        </div>

        {/* Truck */}
        <div
          style={{
            border: hasCarType("truck")
              ? "2px solid #6b7280"
              : "2px solid #8b5cf6",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: hasCarType("truck")
              ? "#374151"
              : "#6d28d9",
            cursor: hasCarType("truck") ? "not-allowed" : "pointer",
            opacity: hasCarType("truck") ? 0.6 : 1,
          }}
          onClick={async () => {
            if (!hasCarType("truck") && !purchasingCar) {
              await mintCarWithConfirmation("premium", "Truck");
            }
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: hasCarType("truck") ? "#9ca3af" : "#8b5cf6",
            }}
          >
            🚚 Truck
          </h3>
          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            <div>⚡ Speed: 85/100</div>
            <div>🎯 Handling: 70/100</div>
            <div>🚀 Acceleration: 90/100</div>
            <div>
              Rarity: <span style={{ color: "#c084fc" }}>Rare</span>
            </div>
          </div>
          <div
            style={{
              background: hasCarType("truck")
                ? "#6b7280"
                : purchasingCar === "Truck"
                ? "#fbbf24"
                : "#8b5cf6",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {hasCarType("truck")
              ? "✅ Purchased"
              : purchasingCar === "Truck"
              ? "⏳ Buying..."
              : "Buy for 0.08 VERY"}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div
        style={{
          marginTop: "40px",
          maxWidth: "800px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginBottom: "16px", color: "#ffd700" }}>
          💡 Vehicle Information
        </h3>
        <div style={{ fontSize: "14px", lineHeight: "1.6", textAlign: "left" }}>
          <p style={{ marginBottom: "12px" }}>
            <strong>🏍️ Bike:</strong> Fast and nimble, perfect for beginners. 
            Lower cost but good handling for tight maneuvers.
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong>🚗 Car:</strong> Balanced performance with good speed and 
            handling. Great for intermediate racers.
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong>🚚 Truck:</strong> Maximum power and speed, but requires 
            skillful handling. For experienced racers only.
          </p>
          <p style={{ color: "#10b981", fontWeight: "bold" }}>
            🎯 Each vehicle has unique stats and racing capabilities!
          </p>
          <p style={{ color: "#8b5cf6", fontWeight: "bold", marginTop: "8px" }}>
            🧬 Breed any two vehicles to create legendary Gen-X Hybrids!
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          ✕ Close Shop
        </button>
      )}
    </div>
  );
};

export default VehicleShop;