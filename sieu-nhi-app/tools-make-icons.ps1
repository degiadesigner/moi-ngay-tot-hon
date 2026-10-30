Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot 'icons'
New-Item -ItemType Directory -Force -Path $out | Out-Null

function Get-StarPoints([float]$cx, [float]$cy, [float]$ro, [float]$ri) {
  $pts = New-Object 'System.Drawing.PointF[]' 10
  for ($i = 0; $i -lt 10; $i++) {
    $r = if ($i % 2 -eq 0) { $ro } else { $ri }
    $a = -[Math]::PI / 2 + $i * [Math]::PI / 5
    $pts[$i] = New-Object System.Drawing.PointF ([float]($cx + $r * [Math]::Cos($a))), ([float]($cy + $r * [Math]::Sin($a)))
  }
  return ,$pts
}

function New-Icon([int]$size, [string]$name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 255, 203, 71)), ([System.Drawing.Color]::FromArgb(255, 255, 122, 154)), 45
  $g.FillRectangle($bg, $rect)
  # vòng sáng
  $glow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(60, 255, 255, 255))
  $g.FillEllipse($glow, [float]($size * 0.12), [float]($size * 0.12), [float]($size * 0.76), [float]($size * 0.76))
  # bóng sao
  $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 160, 40, 70))
  $g.FillPolygon($shadow, (Get-StarPoints ($size / 2) ($size * 0.535) ($size * 0.33) ($size * 0.145)))
  # sao chính
  $star = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillPolygon($star, (Get-StarPoints ($size / 2) ($size * 0.5) ($size * 0.33) ($size * 0.145)))
  # mắt + miệng cute
  $ink = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 91, 63, 224))
  $e = $size * 0.04
  $g.FillEllipse($ink, [float]($size * 0.435 - $e / 2), [float]($size * 0.48), [float]$e, [float]($e * 1.3))
  $g.FillEllipse($ink, [float]($size * 0.565 - $e / 2), [float]($size * 0.48), [float]$e, [float]($e * 1.3))
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 91, 63, 224)), ([float]($size * 0.018))
  $pen.StartCap = 'Round'; $pen.EndCap = 'Round'
  $g.DrawArc($pen, [float]($size * 0.46), [float]($size * 0.52), [float]($size * 0.08), [float]($size * 0.06), 0, 180)
  # má hồng
  $blush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 255, 122, 154))
  $g.FillEllipse($blush, [float]($size * 0.385), [float]($size * 0.545), [float]($size * 0.05), [float]($size * 0.03))
  $g.FillEllipse($blush, [float]($size * 0.565), [float]($size * 0.545), [float]($size * 0.05), [float]($size * 0.03))
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

New-Icon 512 'icon-512.png'
New-Icon 192 'icon-192.png'
New-Icon 180 'apple-touch-icon.png'
Write-Output 'Icons created'

