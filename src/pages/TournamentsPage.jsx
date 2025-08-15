// Chess Tournaments Page - Interactive tournament listings
import React, { useState } from 'react';
import { Calendar, Trophy, Users, Clock, MapPin, Star, ChevronRight, Medal, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

function TournamentsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Tournament data
  const upcomingTournaments = [
    {
      id: 1,
      name: "PawnRace Weekly Blitz",
      type: "blitz",
      date: "2024-01-20",
      time: "19:00 UTC",
      duration: "2 hours",
      participants: 156,
      maxParticipants: 200,
      prizePool: "$500",
      entryFee: "Free",
      rating: "1200-1800",
      status: "registration",
      format: "Swiss System",
      rounds: 7
    },
    {
      id: 2,
      name: "Monthly Rapid Championship",
      type: "rapid",
      date: "2024-01-25",
      time: "16:00 UTC",
      duration: "4 hours",
      participants: 89,
      maxParticipants: 128,
      prizePool: "$1,200",
      entryFee: "$10",
      rating: "1400-2000",
      status: "registration",
      format: "Swiss System",
      rounds: 9
    },
    {
      id: 3,
      name: "Beginner's Arena",
      type: "classical",
      date: "2024-01-27",
      time: "14:00 UTC",
      duration: "6 hours",
      participants: 45,
      maxParticipants: 64,
      prizePool: "$300",
      entryFee: "Free",
      rating: "Under 1200",
      status: "registration",
      format: "Round Robin",
      rounds: 7
    },
    {
      id: 4,
      name: "Grandmaster Invitational",
      type: "classical",
      date: "2024-02-01",
      time: "12:00 UTC",
      duration: "8 hours",
      participants: 8,
      maxParticipants: 16,
      prizePool: "$5,000",
      entryFee: "Invitation Only",
      rating: "2400+",
      status: "upcoming",
      format: "Round Robin",
      rounds: 15
    }
  ];

  const ongoingTournaments = [
    {
      id: 5,
      name: "Winter Speed Festival",
      type: "blitz",
      participants: 234,
      round: "Round 5/9",
      timeRemaining: "2h 15m",
      status: "live",
      prizePool: "$800"
    },
    {
      id: 6,
      name: "Academy Championship",
      type: "rapid", 
      participants: 67,
      round: "Round 3/7",
      timeRemaining: "4h 32m",
      status: "live",
      prizePool: "$1,500"
    }
  ];

  const completedTournaments = [
    {
      id: 7,
      name: "New Year Blitz Bonanza",
      type: "blitz",
      date: "2024-01-01",
      winner: "ChessMaster2024",
      participants: 312,
      prizePool: "$1,000",
      rounds: 11
    },
    {
      id: 8,
      name: "Holiday Classical",
      type: "classical",
      date: "2023-12-25",
      winner: "StrategicMind",
      participants: 128,
      prizePool: "$2,000",
      rounds: 9
    }
  ];

  const typeColors = {
    blitz: "bg-red-100 text-red-800 border-red-200",
    rapid: "bg-blue-100 text-blue-800 border-blue-200",
    classical: "bg-green-100 text-green-800 border-green-200"
  };

  const statusColors = {
    registration: "bg-yellow-100 text-yellow-800 border-yellow-200",
    upcoming: "bg-blue-100 text-blue-800 border-blue-200",
    live: "bg-green-100 text-green-800 border-green-200 animate-pulse"
  };

  const handleJoinTournament = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar onLoginClick={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Trophy className="h-16 w-16 text-primary animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Chess Tournaments
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Compete against players worldwide in exciting tournaments. Test your skills, 
              win prizes, and climb the leaderboards!
            </p>
          </div>
        </div>
      </section>

      {/* Tournament Tabs */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Live Now
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Medal className="h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Tournaments */}
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingTournaments.map((tournament) => (
                  <Card key={tournament.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {tournament.name}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className={typeColors[tournament.type]}>
                            {tournament.type}
                          </Badge>
                          <Badge className={statusColors[tournament.status]}>
                            {tournament.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Tournament Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{tournament.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{tournament.participants}/{tournament.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>{tournament.prizePool}</span>
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entry Fee:</span>
                          <span className="font-semibold">{tournament.entryFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating Range:</span>
                          <span className="font-semibold">{tournament.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Format:</span>
                          <span className="font-semibold">{tournament.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rounds:</span>
                          <span className="font-semibold">{tournament.rounds}</span>
                        </div>
                      </div>
                      
                      {/* Join Button */}
                      <div className="pt-4 border-t">
                        <Button 
                          className="w-full btn-hero group"
                          onClick={handleJoinTournament}
                          disabled={tournament.participants >= tournament.maxParticipants}
                        >
                          {tournament.participants >= tournament.maxParticipants ? 
                            "Tournament Full" : 
                            <>
                              <Trophy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              Join Tournament
                            </>
                          }
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Tournaments */}
            <TabsContent value="live">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ongoingTournaments.map((tournament) => (
                  <Card key={tournament.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-green-200 bg-green-50/50">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-green-800">
                          {tournament.name}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className={typeColors[tournament.type]}>
                            {tournament.type}
                          </Badge>
                          <Badge className="bg-green-500 text-white animate-pulse">
                            LIVE
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-green-100 rounded-lg">
                        <div className="text-2xl font-bold text-green-800 mb-1">
                          {tournament.round}
                        </div>
                        <div className="text-sm text-green-600">
                          Time Remaining: {tournament.timeRemaining}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{tournament.participants} players</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>{tournament.prizePool}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Watch Live
                        </Button>
                        <Button variant="ghost" className="w-full text-sm">
                          View Standings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Completed Tournaments */}
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedTournaments.map((tournament) => (
                  <Card key={tournament.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">
                          {tournament.name}
                        </CardTitle>
                        <Badge className={typeColors[tournament.type]}>
                          {tournament.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <div className="text-lg font-bold mb-1">Winner</div>
                        <div className="text-primary font-semibold">{tournament.winner}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.participants} players</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.prizePool}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-muted-foreground" />
                          <span>{tournament.rounds} rounds</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          View Results
                        </Button>
                        <Button variant="ghost" className="w-full text-sm">
                          Replay Games
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Compete?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of chess players and test your skills in exciting tournaments. 
            Climb the leaderboards and win amazing prizes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-hero"
              onClick={handleJoinTournament}
            >
              Join Next Tournament
            </Button>
            <Button size="lg" variant="outline">
              View Tournament Rules
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default TournamentsPage;