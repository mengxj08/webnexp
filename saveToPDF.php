<?php
session_start();
require('fpdf.php');

$File = "Designed Experiment.pdf";
$session_name = "ResultOfDesign";

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
    $this->Cell(30,10,'Summary of designed experiment',0,0,'C');
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

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'The design of the controlled experiment is as above.',0,1);
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
$pdf->MultiCell(0,10,'To be done',0,1);

$pdf->SetFont('Times','B',15);
$pdf->MultiCell(0,10,'Indepdent variables:',0,1);
$pdf->SetFont('Times','',12);
$pdf->MultiCell(0,10,'To be done',0,1);


for($i=1;$i<=40;$i++)
    $pdf->MultiCell(0,10,'To be done...',0,1);


$pdf->Output();
?>