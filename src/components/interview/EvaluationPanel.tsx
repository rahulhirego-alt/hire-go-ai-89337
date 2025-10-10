import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CandidateInfo {
  name: string;
  position: string;
  skills: string[];
  resumeUrl?: string;
}

interface EvaluationPanelProps {
  sessionId: string;
  candidateInfo: CandidateInfo;
  isRecruiter: boolean;
}

export const EvaluationPanel = ({ sessionId, candidateInfo, isRecruiter }: EvaluationPanelProps) => {
  const { toast } = useToast();
  const [scores, setScores] = useState({
    communication: 0,
    technical: 0,
    confidence: 0,
    overall: 0,
  });
  const [notes, setNotes] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleScoreClick = (category: keyof typeof scores, score: number) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  };

  const handleSaveEvaluation = async () => {
    if (!isRecruiter) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('candidate_evaluations').upsert({
        session_id: sessionId,
        evaluator_id: user.id,
        communication_score: scores.communication || null,
        technical_score: scores.technical || null,
        confidence_score: scores.confidence || null,
        overall_score: scores.overall || null,
        notes,
        private_notes: privateNotes,
      });

      if (error) throw error;

      toast({
        title: 'Evaluation saved',
        description: 'Your evaluation has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save evaluation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderScoreButtons = (category: keyof typeof scores) => (
    <div className="flex gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          onClick={() => handleScoreClick(category, score)}
          className={`w-8 h-8 rounded-full transition-colors ${
            scores[category] >= score
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Circle
            className="w-4 h-4 mx-auto"
            fill={scores[category] >= score ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Candidate Info */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{candidateInfo.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Position applied</p>
            <p className="font-medium">{candidateInfo.position}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {candidateInfo.resumeUrl && (
            <Button variant="outline" className="w-full" asChild>
              <a href={candidateInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Form (Recruiters only) */}
      {isRecruiter && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-medium mb-1">Communication</p>
              {renderScoreButtons('communication')}
            </div>

            <div>
              <p className="font-medium mb-1">Technical</p>
              {renderScoreButtons('technical')}
            </div>

            <div>
              <p className="font-medium mb-1">Confidence</p>
              {renderScoreButtons('confidence')}
            </div>

            <div>
              <p className="font-medium mb-1">Overall</p>
              {renderScoreButtons('overall')}
            </div>

            <div>
              <p className="font-medium mb-2">Notes</p>
              <Textarea
                placeholder="Add notes about the interview..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <p className="font-medium mb-2">Private Notes</p>
              <Textarea
                placeholder="Private notes (visible only to recruiters)..."
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                These notes are only visible to recruiters
              </p>
            </div>

            <Button
              onClick={handleSaveEvaluation}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Evaluation'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
