using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.DTO.Requests;

public record CreateCarRequest
{
    public required string VIN { get; set; }
    public required string Model { get; set; }
    public required string Number { get; set; }
    public required string Status { get; set; }
    public required int TotalKM { get; set; }
}