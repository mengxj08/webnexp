<?php
session_start();
require('fpdf.php');

$File = "Designed Experiment.pdf";
$session_name = "ResultOfDesign";
$session_arrangement = "ResultOfArrangement";

if(!isset($_SESSION[$session_name])) {
    echo "The experiment is not designed successfully!";
} else {
    //echo $_SESSION[$session_name];
}

class PDF extends FPDF
{
// Page header
function Header()
{
    // Logo
    $this->Image('img/logo.png',10,6,30);
    // Arial bold 15
    $this->SetFont('Arial','B',18);
    // Move to the right
    $this->Cell(80);
    // Title
    $this->Cell(30,10,'Experimental Report',0,0,'C');
    // Line break
    $this->Ln(20);
}

// Page footer
function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}
}

$data = (array) json_decode($_SESSION[$session_name],true);
//echo sizeof($data['design_guide']);

// Instanciation of inherited class
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

$pdf->SetFont('Times','',15);
$pdf->MultiCell(0,10,'The design of the controlled experiment is as below.',0,1);
$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Research question:',0,1);

$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,(string)$data['design_guide']['research_question']['general_question'],0,1);

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Experiment title:',0,1);
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,(string)$data['design_guide']['research_question']['experiment_title'],0,1);

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Experiment description:',0,1);
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,(string)$data['design_guide']['research_question']['experiment_description'],0,1);

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Experiment conductor:',0,1);
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,(string)$data['design_guide']['research_question']['experiment_conductor'],0,1);

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Hypothesis:',0,1);
$pdf->SetFont('Times','',12);
$tmpString = "( ";
foreach($data['design_guide']['research_question']['hypothesis']['main_solutions'] as $group)
    $tmpString.= $group['name'].", ";

$tmpString = chop($tmpString, ', ')." ";

$tmpString.=") is better than ( ";

foreach($data['design_guide']['research_question']['hypothesis']['compare_solutions'] as $group)
    $tmpString.= $group['name'].", ";

$tmpString = chop($tmpString, ', ')." ";

$tmpString.=") in ( ";

foreach($data['design_guide']['research_question']['hypothesis']['tasks'] as $group)
    $tmpString.= $group['name'].", ";

$tmpString = chop($tmpString, ', ')." ";
$tmpString.=") under ( ";

foreach($data['design_guide']['research_question']['hypothesis']['contexts'] as $group)
    $tmpString.= $group['name'].", ";

$tmpString = chop($tmpString, ', ')." ";
$tmpString.=") based on ( ";

foreach($data['design_guide']['research_question']['hypothesis']['measures'] as $group)
    $tmpString.= $group['name'].", ";

$tmpString = chop($tmpString, ', ')." ";
$tmpString.=").";

$pdf->MultiCell(0,10,$tmpString,0,1);
$pdf->Ln();

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Indepdent variables:',0,1);

$header = array('Test condition', 'Description');

foreach($data['design_guide']['variables']['independent_variable'] as $group){

    $pdf->SetFont('Times','I',12);
    $pdf->Cell(10,10,"Variable Name:",0,0);
    $pdf->SetFont('Times','',12);
    $pdf->SetX(40);
    $pdf->MultiCell(0,10,(string)$group["name"],0,1);

    $pdf->SetFont('Times','I',12);
    $pdf->Cell(60,10,$header[0],1);
    $pdf->Cell(0,10,$header[1],1);
    $pdf->Ln();

    $pdf->SetFont('Times','',12);
    foreach($group["levels"] as $category){
        $pdf->Cell(60,10,(string)$category["name"],1);
        $pdf->Cell(0,10,(string)$category["description"],1);
        $pdf->Ln();
    }

    $pdf->SetFont('Times','I',12);
    $pdf->Cell(10,10,"Subject design:",0,0);
    $pdf->SetFont('Times','',12);
    $pdf->SetX(40);
    $pdf->MultiCell(0,10,(string)$group["subject_design"],0,1);

    $pdf->SetFont('Times','I',12);
    $pdf->Cell(10,10,"Ordering:",0,0);
    $pdf->SetFont('Times','',12);
    $pdf->SetX(40);
    $pdf->MultiCell(0,10,(string)$group["counter_balance"],0,1);

    $pdf->Ln();
}

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Dependent variables:',0,1);

$header = array('Variable Name', 'Description');
$pdf->SetFont('Times','I',12);
$pdf->Cell(60,10,$header[0],1);
$pdf->Cell(0,10,$header[1],1);
$pdf->Ln();
$pdf->SetFont('Times','',12);
foreach ($data['design_guide']['variables']['dependent_variable'] as $group) {
        $pdf->Cell(60,10,(string)$group["name"],1);
        $pdf->Cell(0,10,(string)$group["description"],1);
        $pdf->Ln();
}
$pdf->Ln();
$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Summary',0,1);
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,"The minimum number of participants is ".$data['design_guide']['arrangement']['min_number'].".",0,1);
$pdf->MultiCell(0,10,"The actual number of participants is ".$data['design_guide']['arrangement']['actual_number'].".",0,1);
$pdf->MultiCell(0,10,"The number of blocks per participant is ".$data['design_guide']['arrangement']['block'].".",0,1);
$pdf->MultiCell(0,10,"The number of trials per condition is ".$data['design_guide']['arrangement']['trial'].".",0,1);
$pdf->MultiCell(0,10,"The time cost of per trial is ".$data['design_guide']['arrangement']['time_per_trial']." seconds.",0,1);
$pdf->MultiCell(0,10,"The time cost of per participant is ".$data['design_guide']['arrangement']['totalTimeCost']." minutes.",0,1);
$pdf->MultiCell(0,10,"The fee of per participant is ".$data['design_guide']['arrangement']['fee_per_participant']." bucks.",0,1);
$pdf->MultiCell(0,10,"The fee of per participant is ".$data['design_guide']['arrangement']['totalPayment']." bucks.",0,1);
$pdf->Ln();

$IVarray = array();
$IVLatinSquare = array();
$IV_i = 0;
$IV_LatinSquare = 0;
$flagWithin = FALSE;
$flagBetween = FALSE;
foreach ($data['design_guide']['variables']['independent_variable'] as $group) {
    $IVarray[$IV_i] = sizeof($group['levels']);
    if($group['subject_design'] == 'Within'){
        $flagWithin = TRUE;
    }
    else{
        $flagBetween = TRUE;
    }
    if($group['counter_balance'] == 'LatinSquare'){
        $IVLatinSquare[$IV_LatinSquare] = $group['name'];
        $IV_LatinSquare++;
    }

    $IV_i++;
}
$design = "";
if($flagWithin && $flagBetween){
    $design = 'mixed-subject';
}
else if($flagWithin){
    $design = 'within-subject';

}
else if($flagBetween){
    $design = 'between-subject';
}
else{}
$para = "The experiment was a ";
if(sizeof($IVarray) != 1){
    $para = "The experiment was a ".implode("*",$IVarray)." "; 
}
$para .= $design." design with ".sizeof($IVarray)." independent variables: ";
foreach($data['design_guide']['variables']['independent_variable'] as $group){
    $tmp = "";
    $i;
    for($i = 0; $i < sizeof($group["levels"]) - 1; $i++){
        $tmp .= $group["levels"][$i]['name'];
        $tmp .= ", ";
    }
    $tmp .= $group["levels"][$i]['name'];
    $para .= $group['name'].' ('.$tmp.'); ';
}
$para = chop($para, '; ').".";

if(sizeof($IVLatinSquare) > 0){
    $para .= " The orders of ".implode(",",$IVLatinSquare)." were counter-balanced with Latin Square. ";
}

if(sizeof($data['design_guide']['variables']['dependent_variable'])!=0){
    $para .= "We considered two dependent variables: ";
    foreach($data['design_guide']['variables']['dependent_variable'] as $group){
        $para .= $group['name'];
        if($group['description'] != "")
            $para .= ' ('.$group['description'].')';

        $para .= ', ';
    }

    $para = chop($para, ', ').". ";
}

$para .= "In summary, the experiement consisted of:";
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,$para,0,1);


$pdf->SetFont('Times','',12);
$pdf->SetX(20);
$pdf->MultiCell(0,10,$data['design_guide']['arrangement']['actual_number'].' Participants *',0,1);
foreach($data['design_guide']['variables']['independent_variable'] as $group){
    $tmp = "";
    $i;
    for($i = 0; $i < sizeof($group["levels"]) - 1; $i++){
        $tmp .= $group["levels"][$i]['name'];
        $tmp .= ", ";
    }
    $tmp .= $group["levels"][$i]['name'];
    $pdf->SetX(20);
    $pdf->MultiCell(0,10,sizeof($group["levels"])." ".$group['name'].' ('.$tmp.') *',0,1);
}
$pdf->SetX(20);
$pdf->MultiCell(0,10,$data['design_guide']['arrangement']['block'].' repetitions of blocks *',0,1);
$pdf->SetX(20);
$pdf->MultiCell(0,10,$data['design_guide']['arrangement']['trial'].' repetitions of trials',0,1);
$pdf->Ln();

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Arrangment of the experiment:',0,1);
$pdf->SetFont('Times','',12);

if(!isset($_SESSION[$session_arrangement])) {
     $pdf->MultiCell(0,10,'The arrangement is not set successfully!',0,1);
 } else {
    $arrangment = (array) json_decode($_SESSION[$session_arrangement],true);
    foreach($arrangment['children'] as $participant){
        $pdf->SetFont('Times','B',12);
        $pdf->MultiCell(0,10,$participant['name'],0,1);
        foreach($participant['children'] as $block){
            $pdf->SetFont('Times','',12);
            $pdf->SetX(20);
            $pdf->MultiCell(0,10,$block['name'],0,1);
            foreach($block['children'] as $condition){
                $pdf->SetX(30);
                $tmpCondition = "";
                foreach($condition['children'] as $trial){
                    $tmpCondition.= $trial['name']." "; 
                }
                $pdf->MultiCell(0,10,$condition['name']." : ".$tmpCondition,0,1);
            }
        }
    }
}

$pdf->Output();
?>