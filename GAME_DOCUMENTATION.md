# Very Racing Game - Complete Documentation

## Quick navigation

1. [Game Overview](#game-overview)
2. [Getting Started](#getting-started)
3. [Car System](#car-system)
4. [Racing Mechanics](#racing-mechanics)
5. [Tokenomics & Rewards](#tokenomics--rewards)
6. [Tournament System](#tournament-system)
7. [Player Progression](#player-progression)
8. [Leaderboard & Statistics](#leaderboard--statistics)
9. [Staking System](#staking-system)
10. [Daily Challenges](#daily-challenges)
11. [User Interface Guide](#user-interface-guide)
12. [Smart Contract Features](#smart-contract-features)
13. [Technical Architecture](#technical-architecture)

---

## Game Overview

Very Racing is a blockchain-based 3D racing game built on the Very network. Players mint unique race cars as NFTs, compete in races, earn cryptocurrency rewards, and climb the global leaderboard. The game combines traditional racing gameplay with Web3 features like NFT ownership, token rewards, and decentralized tournaments.

### Core Features

- **NFT Race Cars**: Each car is a unique blockchain asset with distinct stats
- **Token Rewards**: Earn FAST tokens for completing races and challenges
- **Tournament System**: Compete in organized competitions with prize pools
- **Player Progression**: Level up through racing and earn experience points
- **Staking Rewards**: Stake cars to earn passive XP over time
- **Global Leaderboard**: Track your performance against other players

---

## Getting Started

### First Time Setup

When you launch the game, you'll need to:

1. **Connect Your Wallet**

   - Click "Connect Wallet" on the main screen
   - Approve the MetaMask connection request
   - Ensure you're connected to Very Network

2. **Get Your First Car**

   - Visit the "Car Lot" from the main menu
   - Purchase a Bike for 0.01 XTZ
   - Your new car will appear in your garage

3. **Start Racing**
   - Go to the main menu and click "Start Race"
   - Choose your car and select race parameters
   - Complete the race to earn your first rewards

### Wallet Requirements

- **Network**: Very Network
- **Currency**: VERY (for gas fees and purchases)
- **Minimum Balance**: 0.05 VERY recommended for gameplay

---

## Car System

### Car Types and Pricing

The game features three categories of race cars, each with different performance characteristics:

**Bikes (0.01 XTZ)**

- Speed: 40-60
- Handling: 35-55
- Acceleration: 30-50
- Rarity: Common
- Perfect for beginners and learning the game

**Cars (0.05 XTZ)**

- Speed: 55-75
- Handling: 50-70
- Acceleration: 45-65
- Rarity: Uncommon
- Balanced performance for intermediate players

**Trucks (0.08 XTZ)**

- Speed: 70-90
- Handling: 65-85
- Acceleration: 60-80
- Rarity: Rare
- High-performance cars for experienced racers

### Car Statistics

Each car has four main attributes that affect race performance:

**Speed**

- Determines maximum velocity on straightaways
- Higher speed = faster lap times on tracks with long straights
- Range: 1-100

**Handling**

- Controls cornering ability and stability
- Better handling = smoother turns and less time lost in corners
- Range: 1-100

**Acceleration**

- How quickly the car reaches top speed
- Important for race starts and recovery after corners
- Range: 1-100

**Rarity**

- Affects the potential stat ranges when minting
- Higher rarity = better stat distributions
- Levels: Common, Uncommon, Rare

### Car Ownership

- Each car is an ERC-721 NFT on the Very blockchain
- You have full ownership and can transfer cars between wallets
- Cars retain their stats and racing history permanently
- Each car has a unique ID and can be individually tracked

### Car Garage

Your garage displays all owned cars with:

- Car statistics and rarity
- Racing history (wins, total races)
- Current staking status
- Experience points earned
- Individual car performance metrics

---

## Racing Mechanics

### Race Types

**Practice Races**

- Single-player racing against AI or time trials
- Earn base FAST token rewards
- Build experience and improve skills
- No entry fees required

**Tournament Races**

- Multi-player competitive events
- Higher reward multipliers (5x base rewards)
- Entry fees and prize pools
- Seasonal competitions with special rewards

### Race Physics

The game uses realistic 3D physics simulation:

**Track Navigation**

- Multiple racing circuits with varying difficulty
- Weather conditions affect track grip
- Dynamic obstacles and challenges
- Lap-based progression system

**Performance Calculation**

- Car stats directly influence race outcomes
- Driver skill affects final performance
- Random elements add excitement while maintaining fairness
- Consistent performance tracking for statistics

### Scoring System

Race performance is measured by:

- **Lap Times**: Faster laps = higher scores
- **Position Finishing**: Final race position affects rewards
- **Consistency**: Maintaining steady lap times
- **Track Records**: Bonus points for personal or track records

---

## Tokenomics & Rewards

### FAST Token Overview

The FAST token (ERC-20) serves as the primary reward currency:

- **Total Supply**: 1,000,000 FAST tokens
- **Initial Distribution**: 100,000 tokens minted at launch
- **Reward Distribution**: Tokens minted based on race performance

### Earning Mechanisms

**Race Completion Rewards**

- Base reward: 10 FAST tokens per race
- Performance bonus: 1 FAST token per 100 points scored
- Tournament multiplier: 5x rewards for tournament races
- Daily streak bonuses for consecutive racing days

**Achievement Rewards**

- First race completion: 50 RACE bonus
- Milestone rewards at 10, 50, 100 races
- Leaderboard position bonuses
- Special event participation rewards

**Staking Rewards**

- Passive income from staked cars
- XP accumulation while staking (100 XP per day)
- Staking multipliers based on car rarity
- Compound rewards for long-term staking

### Token Utility

**In-Game Purchases**

- Future car upgrades and customization
- Entry fees for premium tournaments
- Special racing circuits and challenges
- Cosmetic items and car skins

**Governance Features**

- Vote on game updates and features
- Community-driven tournament creation
- Reward structure modifications
- New track and feature proposals

---

## Tournament System

### Tournament Structure

**Public Tournaments**

- Open entry for all players
- Entry fees contributed to prize pool
- Scheduled start and end times
- Automated prize distribution

**Private Tournaments**

- Invitation-only events
- Custom rules and prize structures
- Organized by community members
- Flexible scheduling and formats

### Tournament Mechanics

**Entry Process**

1. Browse available tournaments in the tournament lobby
2. Pay entry fee (varies by tournament)
3. Register your chosen car
4. Wait for tournament start time

**Competition Format**

- Time-based scoring over tournament duration
- Best lap time or cumulative score wins
- Multiple attempts allowed during tournament window
- Real-time leaderboard updates

**Prize Distribution**

- 1st Place: 50% of prize pool
- 2nd Place: 30% of prize pool
- 3rd Place: 20% of prize pool
- Automatic distribution to winner wallets

### Tournament Features

**Leaderboard Tracking**

- Real-time position updates
- Historical performance data
- Player statistics and achievements
- Tournament history and records

**Fair Play Systems**

- Anti-cheat measures and validation
- Performance consistency checking
- Replay system for verification
- Community reporting mechanisms

---

## Player Progression

### Experience Points (XP)

Players earn XP through various activities:

- **Racing**: XP per race completion
- **Winning**: Bonus XP for race victories
- **Staking**: Passive XP generation (100 XP/day per staked car)
- **Tournaments**: Enhanced XP rewards for tournament participation
- **Daily Challenges**: Special XP bonuses

### Player Levels

The progression system includes:

- **Level Calculation**: Based on total XP earned
- **Level Benefits**: Unlock new features and cars
- **Prestige System**: Advanced progression for dedicated players
- **Milestone Rewards**: Special bonuses at key levels

### Career Statistics

Comprehensive tracking includes:

- **Total Races**: Lifetime race participation
- **Win Rate**: Percentage of races won
- **Best Lap Times**: Personal records on each track
- **Earnings**: Total FAST tokens earned
- **Tournament Performance**: Competition history and rankings

### Achievement System

Unlock achievements for:

- Racing milestones (10, 50, 100+ races)
- Winning streaks and consistency
- Tournament victories and placements
- Special challenges and seasonal events
- Community participation and contributions

---

## Leaderboard & Statistics

### Global Rankings

**Overall Leaderboard**

- Ranked by total XP earned
- Displays top 100 players
- Real-time updates after each race
- Historical performance tracking

**Category Rankings**

- Best lap times per track
- Tournament winners and rankings
- Highest single-race scores
- Most active players (races completed)

### Player Profiles

Detailed statistics for each player:

- **Racing History**: Complete race log with results
- **Car Collection**: All owned cars and their stats
- **Achievement Gallery**: Unlocked achievements and progress
- **Tournament Record**: Competition history and performance
- **Token Balance**: Current FAST token holdings

### Seasonal Competitions

**Leaderboard Seasons**

- Monthly competition periods
- Special rewards for top performers
- Season-ending tournaments
- Legacy rankings and hall of fame

**Community Features**

- Player profiles and social features
- Racing clubs and team formation
- Community challenges and events
- Social media integration and sharing

---

## Staking System

### Staking Mechanics

**How Staking Works**

1. Select a car from your garage
2. Choose staking duration
3. Confirm staking transaction
4. Earn passive XP over time (100 XP per day)
5. Unstake anytime to reclaim your car

**Staking Benefits**

- **Passive XP**: Continuous experience point generation
- **No Risk**: Cars remain safe and earn rewards
- **Flexible Duration**: Stake for any length of time
- **Compound Growth**: XP contributes to overall player level

### Staking Strategy

**Optimal Staking**

- Stake cars you're not actively racing
- Higher rarity cars may earn bonus multipliers
- Balance between active racing and passive earning
- Consider staking during tournament preparation

**Risk Management**

- Staked cars cannot participate in races
- No risk of car loss or damage
- Unstaking is immediate with no penalties
- Strategic timing for tournament participation

---

## Daily Challenges

### Challenge Types

**Time Trial Challenges**

- Beat specific lap times on featured tracks
- Rotating daily track selections
- Progressive difficulty throughout the week
- Special weekend bonus challenges

**Performance Challenges**

- Achieve minimum race scores
- Maintain consistency across multiple races
- Complete races with specific car types
- Team-based collaborative challenges

### Challenge Rewards

**Daily Completion**

- 250 FAST tokens per completed challenge
- Bonus XP for challenge completion
- Streak multipliers for consecutive days
- Special achievements for challenge mastery

**Weekly Bonuses**

- Complete all 7 daily challenges for mega-rewards
- Exclusive NFT rewards for perfect weeks
- Leaderboard recognition for top performers
- Access to premium challenges and events

---

## User Interface Guide

### Main Navigation

**Home Screen**

- Wallet connection status
- Player statistics overview
- Quick access to main features
- Latest news and announcements

**Main Menu**

- Start Race: Begin racing experience
- Car Lot: Purchase new cars
- Garage: Manage your car collection
- Leaderboard: View rankings and statistics
- Tournament: Access competitive events

### Race Interface

**Pre-Race Setup**

- Car selection from your garage
- Track selection and preview
- Race parameters and difficulty
- Performance predictions and tips

**Racing HUD**

- Real-time speed and position
- Lap counter and timing
- Car status and performance metrics
- Race progress and leaderboard

**Post-Race Summary**

- Final position and lap times
- Rewards earned (FAST tokens and XP)
- Performance analysis and statistics
- Share results and achievements

### Garage Management

**Car Overview**

- Grid view of all owned cars
- Detailed stats for each vehicle
- Racing history and performance
- Staking status and earnings

**Car Details**

- Complete statistical breakdown
- Racing history and achievements
- Customization options (future feature)
- Transfer and trading capabilities

---

## Smart Contract Features

### Contract Architecture

**VeryRacing Contract**

- Main game logic and car management
- Race result processing and validation
- Player statistics and progression tracking
- Integration with tournament and token systems

**RacingToken Contract**

- FAST token minting and distribution
- Reward calculation and distribution
- Token economics and supply management
- Integration with gameplay mechanics

**VeryTournaments Contract**

- Tournament creation and management
- Prize pool handling and distribution
- Leaderboard tracking and updates
- Fair play enforcement and validation

### Security Features

**Ownership Verification**

- Secure NFT ownership validation
- Anti-fraud measures and protection
- Transparent transaction history
- Immutable record keeping

**Fair Play Systems**

- On-chain validation of race results
- Anti-cheat detection and prevention
- Transparent scoring algorithms
- Community governance and oversight

### Upgradability

**Contract Management**

- Owner-controlled parameter updates
- Emergency pause functionality
- Upgrade mechanisms for improvements
- Community governance integration

**Feature Expansion**

- Modular architecture for new features
- Backward compatibility maintenance
- Seamless integration of updates
- Player-driven feature requests

---

## Technical Architecture

### Frontend Technology

**React + TypeScript**

- Modern web application framework
- Type-safe development environment
- Component-based architecture
- Responsive design for all devices

**Web3 Integration**

- Wagmi for React Web3 hooks
- Viem for blockchain interaction
- MetaMask and wallet connectivity
- Real-time blockchain data synchronization

**3D Graphics Engine**

- Three.js for 3D racing visualization
- WebGL-based rendering pipeline
- Realistic physics simulation
- Cross-platform compatibility

### Blockchain Integration

**Very Network**

- Fast transaction processing
- Low gas fees for gameplay
- Ethereum-compatible smart contracts
- Scalable infrastructure for gaming

**Smart Contract Design**

- Gas-optimized contract architecture
- Modular and upgradeable design
- Comprehensive event logging
- Integration with external protocols

### Performance Optimization

**Client-Side Optimization**

- Efficient state management
- Lazy loading and code splitting
- Caching strategies for blockchain data
- Optimized 3D rendering pipeline

**Blockchain Integration**

- Batched transaction processing
- Event-based state synchronization
- Minimal on-chain computation
- Efficient data structures and storage

---

## Conclusion

Very Racing represents the next evolution of blockchain gaming, combining engaging gameplay with true digital ownership and decentralized economics. Whether you're a casual racer looking for fun or a competitive player seeking glory and rewards, the game offers something for everyone.

The combination of NFT car ownership, token rewards, tournament competition, and community features creates a sustainable gaming ecosystem where players truly own their progress and achievements. Welcome to the future of racing games!

Ready to start your racing fun? Connect your wallet and let's race! 🏁
