using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.Entities;

public sealed class CarEntity
{
    [Key]
    public string VIN { get; set; }

    [Required]
    public string Model { get; set; }

    public string Number { get; set; }

    public string Status { get; set; }

    public int TotalKM { get; set; } = 0;
}