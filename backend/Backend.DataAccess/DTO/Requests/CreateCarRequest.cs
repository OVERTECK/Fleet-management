using System.ComponentModel.DataAnnotations;

namespace Backend.DataAccess.DTO.Requests;

public record CreateCarRequest
{
    public required string VIN { get; init; }
    public required string Model { get; init; }
    public required string Number { get; init; }
    public required string Status { get; init; }
    public required int TotalKM { get; init; }
}