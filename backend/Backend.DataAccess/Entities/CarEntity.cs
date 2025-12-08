using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.Entities;

public sealed class CarEntity
{
    [Key]
    public required string VIN { get; set; }

    public required string Model { get; set; }

    public required string Number { get; set; }

    public required string Status { get; set; }

    public required int TotalKM { get; set; } = 0;
}